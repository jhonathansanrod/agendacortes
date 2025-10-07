import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  durationMin: number;

  @IsInt()
  @Min(0)
  priceCents: number;

  @IsBoolean()
  active: boolean;
}

