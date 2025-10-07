import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: User, @Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.create(user.orgId, createProfessionalDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser() user: User) {
    return this.professionalService.findAll(user.orgId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.professionalService.findOne(user.orgId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalService.update(user.orgId, id, updateProfessionalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.professionalService.remove(user.orgId, id);
  }

  @Get(':id/availability')
  @HttpCode(HttpStatus.OK)
  getAvailability(
    @GetUser() user: User,
    @Param('id') professionalId: string,
    @Query('date') date: string,
  ) {
    return this.professionalService.getAvailability(user.orgId, professionalId, date);
  }
}

