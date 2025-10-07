import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateWorkingHourDto {
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number; // 0 = Sunday, 6 = Saturday

  @IsString()
  @IsNotEmpty()
  startTime: string; // e.g., "09:00"

  @IsString()
  @IsNotEmpty()
  endTime: string; // e.g., "18:00"

  @IsInt()
  @Min(1)
  slotMinutes: number;
}

