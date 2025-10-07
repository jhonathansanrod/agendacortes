import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: User, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(user.orgId, user.id, createAppointmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @GetUser() user: User,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('professionalId') professionalId?: string,
  ) {
    return this.appointmentService.findAll(user.orgId, from, to, professionalId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.appointmentService.findOne(user.orgId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(user.orgId, id, updateAppointmentDto);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@GetUser() user: User, @Param('id') id: string) {
    return this.appointmentService.cancel(user.orgId, id);
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@GetUser() user: User, @Param('id') id: string) {
    return this.appointmentService.confirm(user.orgId, id);
  }

  @Patch(':id/reschedule')
  @HttpCode(HttpStatus.OK)
  reschedule(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('newStartsAt') newStartsAt: string,
    @Body('newEndsAt') newEndsAt: string,
  ) {
    return this.appointmentService.reschedule(user.orgId, id, newStartsAt, newEndsAt);
  }
}

