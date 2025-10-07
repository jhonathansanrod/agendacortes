import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1'); // Set global prefix as per briefing
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

