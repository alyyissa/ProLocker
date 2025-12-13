import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
  ) {}

  async getAll(): Promise<Delivery[]> {
    return this.deliveryRepo.find();
  }

  async getOne(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({ where: { id } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = this.deliveryRepo.create(createDeliveryDto);
    return this.deliveryRepo.save(delivery);
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.getOne(id);
    Object.assign(delivery, updateDeliveryDto);
    return this.deliveryRepo.save(delivery);
  }
}
