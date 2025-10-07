import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProfessionalService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, createProfessionalDto: CreateProfessionalDto) {
    const { userId, bio, active } = createProfessionalDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId, orgId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found in this organization.`);
    }

    // Ensure the user is not already a professional
    const existingProfessional = await this.prisma.professional.findUnique({ where: { userId } });
    if (existingProfessional) {
      throw new BadRequestException(`User with ID "${userId}" is already a professional.`);
    }

    // Update user role to PRO if not already
    if (user.role !== Role.PRO && user.role !== Role.ADMIN) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.PRO },
      });
    }

    return this.prisma.professional.create({
      data: {
        orgId,
        userId,
        bio,
        active,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.professional.findMany({
      where: { orgId },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  async findOne(orgId: string, id: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { id, orgId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${id}" not found for this organization.`);
    }
    return professional;
  }

  async update(orgId: string, id: string, updateProfessionalDto: UpdateProfessionalDto) {
    await this.findOne(orgId, id); // Check if professional exists and belongs to org
    return this.prisma.professional.update({
      where: { id, orgId },
      data: updateProfessionalDto,
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id); // Check if professional exists and belongs to org
    // TODO: Handle associated working hours, exceptions, and appointments before deleting
    return this.prisma.professional.delete({
      where: { id, orgId },
    });
  }

  async getAvailability(
    orgId: string,
    professionalId: string,
    date: string, // YYYY-MM-DD
  ) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId, orgId },
      include: { workingHours: true, scheduleExceptions: true },
    });

    if (!professional) {
      throw new NotFoundException(`Professional with ID "${professionalId}" not found.`);
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 for Sunday, 6 for Saturday

    const workingHour = professional.workingHours.find(wh => wh.weekday === dayOfWeek);

    if (!workingHour) {
      return []; // No working hours defined for this day
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        startsAt: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
        status: { not: 'CANCELLED' },
      },
      select: { startsAt: true, endsAt: true },
    });

    const exceptions = professional.scheduleExceptions.filter(ex => {
      const exStart = new Date(ex.startDateTime);
      const exEnd = new Date(ex.endDateTime);
      return exStart.toDateString() === targetDate.toDateString() || exEnd.toDateString() === targetDate.toDateString();
    });

    const availableSlots = this.generateSlots(
      workingHour.startTime,
      workingHour.endTime,
      workingHour.slotMinutes,
      appointments,
      exceptions,
      targetDate,
    );

    return availableSlots;
  }

  private generateSlots(
    startTime: string,
    endTime: string,
    slotMinutes: number,
    appointments: { startsAt: Date; endsAt: Date }[],
    exceptions: any[], // TODO: Type this properly
    targetDate: Date,
  ): Date[] {
    const slots: Date[] = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentSlot = new Date(targetDate);
    currentSlot.setHours(startHour, startMinute, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(endHour, endMinute, 0, 0);

    while (currentSlot.getTime() < endOfDay.getTime()) {
      const slotEnd = new Date(currentSlot.getTime() + slotMinutes * 60 * 1000);

      let isAvailable = true;

      // Check against existing appointments
      for (const appt of appointments) {
        if (
          (currentSlot < appt.endsAt && slotEnd > appt.startsAt) // Overlap condition
        ) {
          isAvailable = false;
          break;
        }
      }

      // Check against schedule exceptions
      if (isAvailable) {
        for (const ex of exceptions) {
          const exStart = new Date(ex.startDateTime);
          const exEnd = new Date(ex.endDateTime);

          if (ex.type === 'BLOCK' && (currentSlot < exEnd && slotEnd > exStart)) {
            isAvailable = false;
            break;
          }
          // TODO: Handle 'EXTEND' type if needed, though briefing implies it's for overrides, not slot generation
        }
      }

      if (isAvailable) {
        slots.push(new Date(currentSlot));
      }

      currentSlot = slotEnd;
    }

    return slots;
  }
}
