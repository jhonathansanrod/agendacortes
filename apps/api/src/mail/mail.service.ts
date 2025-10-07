import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendAppointmentConfirmation(
    to: string,
    subject: string,
    body: string,
  ) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified domain
      to: to,
      subject: subject,
      html: body,
    });
  }
}

