import { Module } from '@nestjs/common';
import { WorkingHourController } from './working-hour.controller';
import { WorkingHourService } from './working-hour.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkingHourController],
  providers: [WorkingHourService, PrismaService]
})
export class WorkingHourModule {}
