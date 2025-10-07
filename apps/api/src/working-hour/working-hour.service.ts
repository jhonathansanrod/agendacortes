import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';

@Injectable()
export class WorkingHourService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, createWorkingHourDto: CreateWorkingHourDto) {
    const { professionalId, weekday, startTime, endTime, slotMinutes } = createWorkingHourDto;

    const professional = await this.prisma.professional.findUnique({ where: { id: professionalId, orgId } });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${professionalId}" not found in this organization.`);
    }

    const existingWorkingHour = await this.prisma.workingHour.findUnique({
      where: { professionalId_weekday: { professionalId, weekday } },
    });

    if (existingWorkingHour) {
      throw new ConflictException(`Working hours for professional ${professionalId} on weekday ${weekday} already exist.`);
    }

    return this.prisma.workingHour.create({
      data: {
        professionalId,
        weekday,
        startTime,
        endTime,
        slotMinutes,
      },
    });
  }

  async findAll(orgId: string, professionalId: string) {
    const professional = await this.prisma.professional.findUnique({ where: { id: professionalId, orgId } });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${professionalId}" not found in this organization.`);
    }
    return this.prisma.workingHour.findMany({ where: { professionalId } });
  }

  async findOne(orgId: string, id: string) {
    const workingHour = await this.prisma.workingHour.findUnique({
      where: { id },
      include: { professional: { select: { orgId: true } } },
    });

    if (!workingHour || workingHour.professional.orgId !== orgId) {
      throw new NotFoundException(`Working hour with ID "${id}" not found for this organization.`);
    }
    return workingHour;
  }

  async update(orgId: string, id: string, updateWorkingHourDto: UpdateWorkingHourDto) {
    await this.findOne(orgId, id); // Check if working hour exists and belongs to org
    return this.prisma.workingHour.update({
      where: { id },
      data: updateWorkingHourDto,
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id); // Check if working hour exists and belongs to org
    return this.prisma.workingHour.delete({
      where: { id },
    });
  }
}

