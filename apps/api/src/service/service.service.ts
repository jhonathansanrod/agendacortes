import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        orgId,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.service.findMany({ where: { orgId } });
  }

  async findOne(orgId: string, id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id, orgId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found for this organization.`);
    }
    return service;
  }

  async update(orgId: string, id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(orgId, id); // Check if service exists and belongs to org
    return this.prisma.service.update({
      where: { id, orgId },
      data: updateServiceDto,
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id); // Check if service exists and belongs to org
    return this.prisma.service.delete({
      where: { id, orgId },
    });
  }
}

