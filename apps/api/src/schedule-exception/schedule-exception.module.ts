import { Module } from '@nestjs/common';
import { ScheduleExceptionController } from './schedule-exception.controller';
import { ScheduleExceptionService } from './schedule-exception.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ScheduleExceptionController],
  providers: [ScheduleExceptionService, PrismaService]
})
export class ScheduleExceptionModule {}
