import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import Stripe from 'stripe';
import { PaymentProvider, PaymentStatus, AppointmentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(orgId: string, createCheckoutSessionDto: CreateCheckoutSessionDto) {
    const { appointmentId } = createCheckoutSessionDto;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId, orgId },
      include: { service: true, client: true, professional: { include: { user: true } } },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${appointmentId}" not found.`);
    }

    if (appointment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Appointment is already paid.');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: appointment.service.name,
              description: `Agendamento com ${appointment.professional.user.name} em ${appointment.startsAt.toLocaleString()}`,
            },
            unit_amount: appointment.service.priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_BASE_URL}/app/${appointment.organization.slug}/appointments/${appointment.id}?success=true`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/app/${appointment.organization.slug}/appointments/${appointment.id}?canceled=true`,
      metadata: {
        appointmentId: appointment.id,
        orgId: appointment.orgId,
      },
    });

    // Create a pending payment record
    await this.prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.REQUIRES_PAYMENT,
        amountCents: appointment.service.priceCents,
        currency: 'brl',
        providerRef: session.id,
      },
    });

    return { url: session.url };
  }

  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    const appointmentId = event.data.object["metadata"].appointmentId;
    const orgId = event.data.object["metadata"].orgId;

    switch (event.type) {
      case 'checkout.session.completed':
        await this.prisma.payment.update({
          where: { providerRef: event.data.object["id"] },
          data: { status: PaymentStatus.PAID },
        });
        await this.prisma.appointment.update({
          where: { id: appointmentId, orgId },
          data: { status: AppointmentStatus.CONFIRMED },
        });
        break;
      case 'checkout.session.async_payment_failed':
        await this.prisma.payment.update({
          where: { providerRef: event.data.object["id"] },
          data: { status: PaymentStatus.FAILED },
        });
        // Optionally, update appointment status or notify admin
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}

