import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';
import { UpdateScheduleExceptionDto } from './dto/update-schedule-exception.dto';

@Injectable()
export class ScheduleExceptionService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, createScheduleExceptionDto: CreateScheduleExceptionDto) {
    const { professionalId, startDateTime, endDateTime, type } = createScheduleExceptionDto;

    const professional = await this.prisma.professional.findUnique({ where: { id: professionalId, orgId } });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${professionalId}" not found in this organization.`);
    }

    return this.prisma.scheduleException.create({
      data: {
        professionalId,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        type,
      },
    });
  }

  async findAll(orgId: string, professionalId: string) {
    const professional = await this.prisma.professional.findUnique({ where: { id: professionalId, orgId } });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${professionalId}" not found in this organization.`);
    }
    return this.prisma.scheduleException.findMany({ where: { professionalId } });
  }

  async findOne(orgId: string, id: string) {
    const scheduleException = await this.prisma.scheduleException.findUnique({
      where: { id },
      include: { professional: { select: { orgId: true } } },
    });

    if (!scheduleException || scheduleException.professional.orgId !== orgId) {
      throw new NotFoundException(`Schedule exception with ID "${id}" not found for this organization.`);
    }
    return scheduleException;
  }

  async update(orgId: string, id: string, updateScheduleExceptionDto: UpdateScheduleExceptionDto) {
    await this.findOne(orgId, id); // Check if exception exists and belongs to org
    return this.prisma.scheduleException.update({
      where: { id },
      data: {
        ...updateScheduleExceptionDto,
        startDateTime: updateScheduleExceptionDto.startDateTime ? new Date(updateScheduleExceptionDto.startDateTime) : undefined,
        endDateTime: updateScheduleExceptionDto.endDateTime ? new Date(updateScheduleExceptionDto.endDateTime) : undefined,
      },
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id); // Check if exception exists and belongs to org
    return this.prisma.scheduleException.delete({
      where: { id },
    });
  }
}

