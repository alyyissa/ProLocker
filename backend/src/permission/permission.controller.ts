import { Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  addAdmin(@Param('userId') userId: string){
    return this.permissionService.addAdmin(+userId)
  }

  @Get(':userId')
  isAdmin(@Param('userId') userId: string) {
    return this.permissionService.isAdmin(+userId);
  }
}
