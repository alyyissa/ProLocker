import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const uploadsBase = process.env.UPLOADS_PATH || 'uploads';
  const categoriesFolder = process.env.CATEGORY_UPLOAD_PATH || 'categories';
  const productsFolder = process.env.PRODUCT_UPLOAD_PATH || 'products';

  app.use(
    `/uploads/${categoriesFolder}`,
    express.static(join(__dirname, '..', uploadsBase, categoriesFolder)),
  );
  app.use(
    `/uploads/${productsFolder}`,
    express.static(join(__dirname, '..', uploadsBase, productsFolder)),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
