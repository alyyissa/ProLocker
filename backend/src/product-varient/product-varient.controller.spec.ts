import { Test, TestingModule } from '@nestjs/testing';
import { ProductVarientController } from './product-varient.controller';
import { ProductVarientService } from './product-varient.service';

describe('ProductVarientController', () => {
  let controller: ProductVarientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVarientController],
      providers: [ProductVarientService],
    }).compile();

    controller = module.get<ProductVarientController>(ProductVarientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
