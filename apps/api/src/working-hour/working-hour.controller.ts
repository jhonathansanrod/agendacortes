import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { WorkingHourService } from './working-hour.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('working-hours')
export class WorkingHourController {
  constructor(private readonly workingHourService: WorkingHourService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: User, @Body() createWorkingHourDto: CreateWorkingHourDto) {
    return this.workingHourService.create(user.orgId, createWorkingHourDto);
  }

  @Get('professional/:professionalId')
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser() user: User, @Param('professionalId') professionalId: string) {
    return this.workingHourService.findAll(user.orgId, professionalId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.workingHourService.findOne(user.orgId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateWorkingHourDto: UpdateWorkingHourDto) {
    return this.workingHourService.update(user.orgId, id, updateWorkingHourDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.workingHourService.remove(user.orgId, id);
  }
}

