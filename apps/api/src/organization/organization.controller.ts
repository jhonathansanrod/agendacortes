import { Body, Controller, Get, Param, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('org')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Protect this route
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get(':slug/public')
  @HttpCode(HttpStatus.OK)
  findPublicBySlug(@Param('slug') slug: string) {
    return this.organizationService.findPublicBySlug(slug);
  }
}

