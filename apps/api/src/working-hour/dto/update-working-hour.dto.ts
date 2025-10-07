import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkingHourDto } from './create-working-hour.dto';

export class UpdateWorkingHourDto extends PartialType(CreateWorkingHourDto) {}

