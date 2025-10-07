import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleExceptionType } from '@prisma/client';

export class CreateScheduleExceptionDto {
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsDateString()
  @IsNotEmpty()
  startDateTime: string;

  @IsDateString()
  @IsNotEmpty()
  endDateTime: string;

  @IsEnum(ScheduleExceptionType)
  @IsNotEmpty()
  type: ScheduleExceptionType;
}

