import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  getAll() {
    return this.deliveryService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.deliveryService.getOne(id);
  }

  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, updateDeliveryDto);
  }
}
