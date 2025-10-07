import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async create(orgId: string, clientId: string, createAppointmentDto: CreateAppointmentDto) {
    const { professionalId, serviceId, startsAt, endsAt, notes } = createAppointmentDto;

    // Validate professional and service belong to the organization
    const professional = await this.prisma.professional.findUnique({ where: { id: professionalId, orgId } });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${professionalId}" not found in this organization.`);
    }

    const service = await this.prisma.service.findUnique({ where: { id: serviceId, orgId } });
    if (!service) {
      throw new NotFoundException(`Service with ID "${serviceId}" not found in this organization.`);
    }

    // Basic availability check (more detailed logic in professional service)
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        professionalId,
        startsAt: { lt: new Date(endsAt) },
        endsAt: { gt: new Date(startsAt) },
        status: { not: AppointmentStatus.CANCELLED },
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Professional is not available at the requested time.');
    }

    const newAppointment = await this.prisma.appointment.create({
      data: {
        orgId,
        clientId,
        professionalId,
        serviceId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        notes,
        status: AppointmentStatus.PENDING, // Default status
      },
      include: { client: true, professional: { include: { user: true } }, service: true, organization: true },
    });

    // Send confirmation email to client
    await this.mailService.sendAppointmentConfirmation(
      newAppointment.client.email,
      'Confirmação de Agendamento - AgendaCortes',
      `Olá ${newAppointment.client.name},
      Seu agendamento para ${newAppointment.service.name} com ${newAppointment.professional.user.name}
      em ${newAppointment.startsAt.toLocaleString()} foi criado com sucesso.
      Status: PENDENTE.`, // Simplified HTML for now
    );

    return newAppointment;
  }

  async findAll(orgId: string, from?: string, to?: string, professionalId?: string) {
    const where: any = { orgId };

    if (professionalId) {
      where.professionalId = professionalId;
    }

    if (from || to) {
      where.startsAt = {};
      if (from) where.startsAt.gte = new Date(from);
      if (to) where.startsAt.lt = new Date(to);
    }

    return this.prisma.appointment.findMany({
      where,
      include: { client: { select: { name: true, email: true } }, professional: { select: { user: { select: { name: true } } } }, service: true },
      orderBy: { startsAt: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, orgId },
      include: { client: { select: { name: true, email: true } }, professional: { select: { user: { select: { name: true } } } }, service: true },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found for this organization.`);
    }
    return appointment;
  }

  async update(orgId: string, id: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findOne(orgId, id); // Check if appointment exists and belongs to org
    return this.prisma.appointment.update({
      where: { id, orgId },
      data: {
        ...updateAppointmentDto,
        startsAt: updateAppointmentDto.startsAt ? new Date(updateAppointmentDto.startsAt) : undefined,
        endsAt: updateAppointmentDto.endsAt ? new Date(updateAppointmentDto.endsAt) : undefined,
      },
    });
  }

  async cancel(orgId: string, id: string) {
    const appointment = await this.findOne(orgId, id);
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled.');
    }
    const cancelledAppointment = await this.prisma.appointment.update({
      where: { id, orgId },
      data: { status: AppointmentStatus.CANCELLED },
      include: { client: true, professional: { include: { user: true } }, service: true, organization: true },
    });

    await this.mailService.sendAppointmentConfirmation(
      cancelledAppointment.client.email,
      'Agendamento Cancelado - AgendaCortes',
      `Olá ${cancelledAppointment.client.name},
      Seu agendamento para ${cancelledAppointment.service.name} com ${cancelledAppointment.professional.user.name}
      em ${cancelledAppointment.startsAt.toLocaleString()} foi cancelado.`, // Simplified HTML for now
    );

    return cancelledAppointment;
  }

  async confirm(orgId: string, id: string) {
    const appointment = await this.findOne(orgId, id);
    if (appointment.status === AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Appointment is already confirmed.');
    }
    const confirmedAppointment = await this.prisma.appointment.update({
      where: { id, orgId },
      data: { status: AppointmentStatus.CONFIRMED },
      include: { client: true, professional: { include: { user: true } }, service: true, organization: true },
    });

    await this.mailService.sendAppointmentConfirmation(
      confirmedAppointment.client.email,
      'Agendamento Confirmado - AgendaCortes',
      `Olá ${confirmedAppointment.client.name},
      Seu agendamento para ${confirmedAppointment.service.name} com ${confirmedAppointment.professional.user.name}
      em ${confirmedAppointment.startsAt.toLocaleString()} foi confirmado.`, // Simplified HTML for now
    );

    return confirmedAppointment;
  }

  async reschedule(orgId: string, id: string, newStartsAt: string, newEndsAt: string) {
    const appointment = await this.findOne(orgId, id);

    // Basic availability check for reschedule
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        professionalId: appointment.professionalId,
        startsAt: { lt: new Date(newEndsAt) },
        endsAt: { gt: new Date(newStartsAt) },
        status: { not: AppointmentStatus.CANCELLED },
        id: { not: id }, // Exclude the current appointment
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Professional is not available at the requested new time.');
    }

    const rescheduledAppointment = await this.prisma.appointment.update({
      where: { id, orgId },
      data: {
        startsAt: new Date(newStartsAt),
        endsAt: new Date(newEndsAt),
        status: AppointmentStatus.PENDING, // Reset status to PENDING after reschedule
      },
      include: { client: true, professional: { include: { user: true } }, service: true, organization: true },
    });

    await this.mailService.sendAppointmentConfirmation(
      rescheduledAppointment.client.email,
      'Agendamento Reagendado - AgendaCortes',
      `Olá ${rescheduledAppointment.client.name},
      Seu agendamento para ${rescheduledAppointment.service.name} com ${rescheduledAppointment.professional.user.name}
      foi reagendado para ${rescheduledAppointment.startsAt.toLocaleString()}. Status: PENDENTE.`, // Simplified HTML for now
    );

    return rescheduledAppointment;
  }
}

