import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DEFAULT_APP_PORT } from './app.constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? DEFAULT_APP_PORT);
}
void bootstrap();
