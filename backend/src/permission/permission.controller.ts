import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Logger } from '@nestjs/common';


@Controller('permissions')
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(private readonly permissionService: PermissionService) {}

  @Get('is-admin')
  @UseGuards(JwtAuthGuard)
  async isAdmin(@Request() req) {
    
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    
    if (!userId) {
      this.logger.error('No user ID found in request!');
      return { isAdmin: false };
    }
    
    const isAdmin = await this.permissionService.isAdmin(userId);
    return { isAdmin };
  }
}
