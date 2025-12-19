import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination.query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll(@Query() filterDto: OrderFilterDto) {
    return this.ordersService.findAll(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders/:userId')
  async findForUser(@Param('userId') userId: string, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.ordersService.findForUser(+userId, paginationQueryDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.ordersService.findOne(+id, req.user.id);
  }
  
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/:id')
  async findOneAdmin(@Param('id') id: string) {
    const orderId = +id;
    return this.ordersService.findOneByAdmin(orderId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStatus(+id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Get('admin/stats/sales-summary')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getSalesSummary() {
    return this.ordersService.getSalesSummary();
  }

  @Get('admin/stats/revenue-trend')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getRevenueTrend(@Query('days') days: string) {
    const daysNum = days ? parseInt(days) : 30;
    return this.ordersService.getRevenueTrend(daysNum);
  }

  @Get('admin/stats/top-products')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getTopProducts(@Query('limit') limit: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return this.ordersService.getTopProducts(limitNum);
  }
}
