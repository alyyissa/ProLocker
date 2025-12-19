import { Controller, Get, Patch, Param, Body, Post, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('active')
  getActiveBanner() {
    return this.bannerService.getActiveBanner();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  createBanner(@Body() body: { text: string; isActive?: boolean }) {
    return this.bannerService.createBanner(body.text, body.isActive ?? true);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  updateBanner(
    @Param('id') id: string,
    @Body() body: { text: string; isActive: boolean },
  ) {
    return this.bannerService.updateBanner(+id, body.text, body.isActive);
  }
}
