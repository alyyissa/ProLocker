import { Controller, Get, Patch, Param, Body, Post } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('active')
  getActiveBanner() {
    return this.bannerService.getActiveBanner();
  }

  @Post()
  createBanner(@Body() body: { text: string; isActive?: boolean }) {
    return this.bannerService.createBanner(body.text, body.isActive ?? true);
  }

  @Patch(':id')
  updateBanner(
    @Param('id') id: string,
    @Body() body: { text: string; isActive: boolean },
  ) {
    return this.bannerService.updateBanner(+id, body.text, body.isActive);
  }
}
