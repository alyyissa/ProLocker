import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { ProductVarient } from 'src/product-varient/entities/product-varient.entity';
import { OrderStatus } from './enums/orders.status.enum';
import { DataSource } from 'typeorm';
import { ProductVarientService } from 'src/product-varient/product-varient.service';
import { OrderFilterDto } from './dto/order-filter.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,

    private readonly productVarientService: ProductVarientService,

    private readonly datasource: DataSource,
) {}

  async create(createOrderDto: CreateOrderDto) {
  return await this.datasource.transaction(async manager => {
    const user = await manager.findOne(User, {
      where: { id: createOrderDto.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentOrderCount = await manager.count(Order, {
      where: {
        user: { id: user.id },
        createdAt: MoreThanOrEqual(oneWeekAgo),
      },
    });

    if (recentOrderCount >= 3) {
      throw new BadRequestException('You cant order more than three times per week');
    }

    const trackingNumber = this.generateTrackingNumber();

    const order = await manager.save(Order, {
      user,
      phoneNumber: createOrderDto.phoneNumber,
      address: createOrderDto.address,
      firstName: createOrderDto.firstName,
      lastName: createOrderDto.lastName,
      apartment: createOrderDto.apartment,
      city: createOrderDto.city,
      email: createOrderDto.email,
      country: createOrderDto.country ?? 'Lebanon',
      trackingNumber,
      status: OrderStatus.PENDING,
      totalPrice: 0,
    });

    let totalPrice = 0;

    for (const item of createOrderDto.items) {
      const productVarient = await manager.findOne(ProductVarient, {
        where: { id: item.productVarientId },
        relations: ['product'],
      });

      if (!productVarient) throw new NotFoundException(`Product ${item.productVarientId} not found`);

      await this.productVarientService.reduceStock(item.productVarientId, item.quantity, manager);

      const orderItem = await manager.save(OrderItem, {
        order,
        productVarient,
        quantity: item.quantity,
        unitPrice: productVarient.product.price,
        totalPrice: productVarient.product.price * item.quantity,
      });

      totalPrice += orderItem.totalPrice;
    }

    order.totalPrice = totalPrice;
    await manager.save(order);

    return {
      message: 'Order created successfully',
      trackingNumber,
      orderId: order.id,
    };
  });
}


  async findAll(filters: OrderFilterDto) {
    const {status, date, page = 1, limit= 1} = filters;

    const query = this.orderRepository.
    createQueryBuilder('order')
    .leftJoinAndSelect('order.user', 'user')
    .leftJoinAndSelect('order.orderItems', 'orderItems');

    if(status){
      query.andWhere('order.status = :status', {status});
    }

    if (date) {
      switch (date) {
        case 'today':
          query.andWhere('DATE(order.createdAt) = CURDATE()');
          break;

        case 'yesterday':
          query.andWhere('DATE(order.createdAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)');
          break;

        case 'thisWeek':
          query.andWhere('YEARWEEK(order.createdAt, 1) = YEARWEEK(CURDATE(), 1)');
          break;

        case 'lastWeek':
          query.andWhere('YEARWEEK(order.createdAt, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL 1 WEEK), 1)');
          break;

        case 'thisMonth':
          query.andWhere('MONTH(order.createdAt) = MONTH(CURDATE()) AND YEAR(order.createdAt) = YEAR(CURDATE())');
          break;

        case 'lastMonth':
          query.andWhere(`
            MONTH(order.createdAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            AND YEAR(order.createdAt) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
          `);
          break;

        case 'thisYear':
          query.andWhere('YEAR(order.createdAt) = YEAR(CURDATE())');
          break;

        case 'lastYear':
          query.andWhere('YEAR(order.createdAt) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))');
          break;
      }
    }
    const total = await query.getCount();
    const totalPages = Math.ceil(total / limit);
    const currentPage = page > totalPages ? totalPages : page;

    query.skip((currentPage - 1) * limit).take(limit);

    const [data] = await query.orderBy('order.createdAt', 'DESC').getManyAndCount();

    return {
      data,
      total,
      page: currentPage,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  private generateTrackingNumber(): string {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0');

    return `ORD-${y}${m}${d}-${random}`;
  }

  async findOne(id: number, userId:number) {
    const order = await this.orderRepository.findOne({
      where: {id},
      relations: ['orderItems', 'orderItems.productVarient', 'orderItems.productVarient.product']
    });
    if(!order) throw new NotFoundException('Order not found');

    if (order.user.id !== userId) {
    throw new ForbiddenException('You are not allowed to access this order');
    }
    return order;
  }

  async findForUser(
    userId: number,
    options : { page?: number; limit?: number } = {}
    ) {
    const { page = 1, limit = 3 } = options;

    const total = await this.orderRepository.count({
      where: { user: { id: userId } },
    });

    if (total === 0) {
    return {
      orders: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 1
    };
  }

    const totalPages = Math.ceil(total / limit);
    const currentPage = page > totalPages ? totalPages : page;

    const [orders] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.productVarient', 'orderItems.productVarient.product'],
      order: { createdAt: 'DESC' },
      skip: (currentPage - 1) * limit,
      take: limit,
    });

    return {
      orders,
      total,
      page: currentPage,
      limit,
      totalPages
    };
  }

  async updateStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({where: {id}, relations:['orderItems', 'orderItems.productVarient', 'orderItems.productVarient.product']});
    if(!order) throw new NotFoundException('Order not found');
    if(!updateOrderDto.status) throw new InternalServerErrorException('no status provided')

    const oldStatus  = order.status

    return await this.datasource.transaction(async (manager) => {
      
      if(updateOrderDto.status === OrderStatus.DECLINED &&
        oldStatus !== OrderStatus.DECLINED
      )
      {
        for (const item of order.orderItems){
          await this.productVarientService.restoreStock(
            item.productVarient.id,
            item.quantity,
            manager
          )
        }
      }
      
      if(
        updateOrderDto.status !== OrderStatus.DECLINED &&
        oldStatus === OrderStatus.DECLINED
      ){
        for (const  itme of order.orderItems){
        await this.productVarientService.reduceStock(
          itme.productVarient.id,
          itme.quantity,
          manager
        )
        }
      }

      order.status = updateOrderDto.status as any;

      return this.orderRepository.save(order)
    })
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({where: {id}});

    if(!order) throw new NotFoundException('Order dont exist')

    if(order.status !== OrderStatus.DECLINED){
      throw new BadRequestException('Only declined orders can be deleted')
    }

    await this.orderRepository.delete(id)

    return 'Deleted successfully';
  }

}
