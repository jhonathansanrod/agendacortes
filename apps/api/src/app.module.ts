import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { OrganizationModule } from './organization/organization.module';
import { ServiceModule } from './service/service.module';
import { ProfessionalModule } from './professional/professional.module';
import { WorkingHourModule } from './working-hour/working-hour.module';
import { ScheduleExceptionModule } from './schedule-exception/schedule-exception.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PaymentModule } from './payment/payment.module';
import { MailModule } from './mail/mail.module';

@Module({
 imports: [AuthModule, OrganizationModule, ServiceModule, ProfessionalModule, WorkingHourModule, ScheduleExceptionModule, AppointmentModule, PaymentModule, MailModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
