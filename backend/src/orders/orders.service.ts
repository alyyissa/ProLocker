import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
) {}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOneBy({id: createOrderDto.userId});
    if (!user) throw new Error('User not found');

    const order = this.orderRepository.create({
      user,
      phoneNumber: createOrderDto.phoneNumber,
      address: createOrderDto.address,
      status: "Pending",
      orderItems: [],
    });

    let totalOrderPrice = 0;

    for(const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId }
      });
    
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);

      const orderItem = this.orderItemRepository.create({
        order,
        product,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
      });

      totalOrderPrice += orderItem.totalPrice;
      order.orderItems.push(orderItem);
    }

    const savedOrder = await this.orderRepository.save(order);

    return{
      message: 'Order created successfully',
      order: savedOrder,
    }

}

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
