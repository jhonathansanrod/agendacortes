import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: User, @Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(user.orgId, createServiceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser() user: User) {
    return this.serviceService.findAll(user.orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.serviceService.findOne(user.orgId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(user.orgId, id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.serviceService.remove(user.orgId, id);
  }
}

