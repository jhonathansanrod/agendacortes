import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ServiceController', () => {
  let controller: ServiceController;
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [ServiceService, PrismaService],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    service = module.get<ServiceService>(ServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

