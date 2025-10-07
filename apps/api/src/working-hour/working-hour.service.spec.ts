import { Test, TestingModule } from '@nestjs/testing';
import { WorkingHourService } from './working-hour.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WorkingHourService', () => {
  let service: WorkingHourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkingHourService, PrismaService],
    }).compile();

    service = module.get<WorkingHourService>(WorkingHourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

