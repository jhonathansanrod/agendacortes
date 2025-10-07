import { Test, TestingModule } from '@nestjs/testing';
import { WorkingHourController } from './working-hour.controller';
import { WorkingHourService } from './working-hour.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WorkingHourController', () => {
  let controller: WorkingHourController;
  let service: WorkingHourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkingHourController],
      providers: [WorkingHourService, PrismaService],
    }).compile();

    controller = module.get<WorkingHourController>(WorkingHourController);
    service = module.get<WorkingHourService>(WorkingHourService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

