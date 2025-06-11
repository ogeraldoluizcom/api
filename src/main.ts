import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3001',
        'https://development.ogeraldoluiz.com',
        'https://staging.ogeraldoluiz.com',
        'https://ogeraldoluiz.com',
        'https://app.ogeraldoluiz.com',
        'https://app.development.ogeraldoluiz.com',
        'https://app.staging.ogeraldoluiz.com',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
