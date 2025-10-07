import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfessionalDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // Existing user ID to link to a professional profile

  @IsString()
  bio?: string;

  @IsBoolean()
  active: boolean;
}

