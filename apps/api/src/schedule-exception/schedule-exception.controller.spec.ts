import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleExceptionController } from './schedule-exception.controller';
import { ScheduleExceptionService } from './schedule-exception.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScheduleExceptionController', () => {
  let controller: ScheduleExceptionController;
  let service: ScheduleExceptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleExceptionController],
      providers: [ScheduleExceptionService, PrismaService],
    }).compile();

    controller = module.get<ScheduleExceptionController>(ScheduleExceptionController);
    service = module.get<ScheduleExceptionService>(ScheduleExceptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

