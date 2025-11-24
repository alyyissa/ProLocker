import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { ProductVarient } from 'src/product-varient/entities/product-varient.entity';
import { OrderStatus } from './enums/orders.status.enum';
import { DataSource } from 'typeorm';
import { ProductVarientService } from 'src/product-varient/product-varient.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(ProductVarient)
    private readonly productVarientRepository: Repository<ProductVarient>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly productVarientService: ProductVarientService,

    private readonly datasource: DataSource,
) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.datasource.transaction(async manager => {
    try {
      const user = await manager.findOne(User, {
        where: { id: createOrderDto.userId },
      });

      if(!user) throw new NotFoundException('User not found');

      const trackingNumber = this.generateTrackingNumber();

      // Create Order
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
      });

      // Save Order Items
      for (const item of createOrderDto.items) {
        const productVarient = await manager.findOne(ProductVarient, {
          where: { id: item.productVarientId },
          relations: ['product'],
        });

        if (!productVarient)
          throw new NotFoundException(
            `Product ${item.productVarientId} not found`,
          );

        await this.productVarientService.reduceStock(
          item.productVarientId,
          item.quantity,
          manager
        );

        await manager.save( OrderItem, {
          order,
          productVarient,
          quantity: item.quantity,
          unitPrice: productVarient.product.price,
          totalPrice: productVarient.product.price * item.quantity,
          // status: OrderStatus.PENDING,
        });
      }

      return {
        message: 'Order created successfully',
        trackingNumber,
        orderId: order.id,
      };

    } catch (error) {
      console.error('Order Creation Error:', error);
      throw error;
    }
  });
  }


  async findAll(){
    return `This action orders`;
  }

  async findBestSellr(){
    return `This action best seller orders`;
  }

  private generateTrackingNumber(): string {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0');

    return `ORD-${y}${m}${d}-${random}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async updateStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({where: {id}});
    if(!order) throw new NotFoundException('Order not found');

    if(updateOrderDto.status)
      {
        order.status  = updateOrderDto.status;
      }else
      {
        throw new InternalServerErrorException('No status provided for update');
      }

    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
    throw new NotFoundException('Product not found');
    }

    return 'Deleted successfully';
  }
}
