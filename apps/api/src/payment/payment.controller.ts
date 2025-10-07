import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { Request } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  @HttpCode(HttpStatus.CREATED)
  createCheckoutSession(
    @GetUser() user: User,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(user.orgId, createCheckoutSessionDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
  ) {
    return this.paymentService.handleStripeWebhook(signature, req.rawBody);
  }
}

