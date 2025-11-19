import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
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
    try {
      const user = await this.userRepository.findOne({
        where: { id: createOrderDto.userId },
      });
      if (!user) throw new NotFoundException('User not found');

      // Creating order
      const order = await this.orderRepository.save({
        user,
        phoneNumber: createOrderDto.phoneNumber,
        address: createOrderDto.address,
        status: 'Pending',
      });

      // Adding order items one-by-one
      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product ${item.productId} not found`,
          );
        }

        await this.orderItemRepository.save({
          order,
          product,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: product.price * item.quantity,
        });
      }
      
      return "Order created successfully";

    } catch (error) {
      console.error('Real Error:', error);
      throw error;
    }
  }

  async findAll(){
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
    throw new NotFoundException('Product not found');
    }

    return 'Deleted successfully';
  }
}
