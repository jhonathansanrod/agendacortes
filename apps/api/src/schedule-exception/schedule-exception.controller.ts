import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ScheduleExceptionService } from './schedule-exception.service';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';
import { UpdateScheduleExceptionDto } from './dto/update-schedule-exception.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('schedule-exceptions')
export class ScheduleExceptionController {
  constructor(private readonly scheduleExceptionService: ScheduleExceptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: User, @Body() createScheduleExceptionDto: CreateScheduleExceptionDto) {
    return this.scheduleExceptionService.create(user.orgId, createScheduleExceptionDto);
  }

  @Get('professional/:professionalId')
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser() user: User, @Param('professionalId') professionalId: string) {
    return this.scheduleExceptionService.findAll(user.orgId, professionalId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.scheduleExceptionService.findOne(user.orgId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateScheduleExceptionDto: UpdateScheduleExceptionDto) {
    return this.scheduleExceptionService.update(user.orgId, id, updateScheduleExceptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.scheduleExceptionService.remove(user.orgId, id);
  }
}

