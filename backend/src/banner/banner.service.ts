// src/banner/banner.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async createBanner(text: string, isActive: boolean) {
    const banner = this.bannerRepository.create({ text, isActive });
    return this.bannerRepository.save(banner);
  }

  async getActiveBanner() {
    return this.bannerRepository.findOne({ where: { isActive: true } });
  }

  async updateBanner(id: number, text: string, isActive: boolean) {
    await this.bannerRepository.update(id, { text, isActive });
    return this.bannerRepository.findOne({ where: { id } });
  }
}
