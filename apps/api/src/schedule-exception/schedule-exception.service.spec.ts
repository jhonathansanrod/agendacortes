import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleExceptionService } from './schedule-exception.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScheduleExceptionService', () => {
  let service: ScheduleExceptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleExceptionService, PrismaService],
    }).compile();

    service = module.get<ScheduleExceptionService>(ScheduleExceptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

