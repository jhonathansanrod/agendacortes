import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1'); // Set global prefix as per briefing
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0'); // <- importante no Render
}
bootstrap();

