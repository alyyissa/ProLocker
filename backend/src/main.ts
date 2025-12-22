// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as express from 'express';
// import { join } from 'path';
// import fs from 'fs';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: { enableImplicitConversion: true },
//     }),
//   );

//   const uploadsBase = process.env.UPLOADS_PATH!;
//   const categoriesFolder = process.env.CATEGORY_UPLOAD_PATH || 'categories';
//   const productsFolder = process.env.PRODUCT_UPLOAD_PATH || 'products';

//   const categoriesPath = join(uploadsBase, categoriesFolder);
//   const productsPath = join(uploadsBase, productsFolder);

//   [categoriesPath, productsPath].forEach((dir) => {
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//   });

//   app.use(`/uploads/${categoriesFolder}`, express.static(categoriesPath));
//   app.use(`/uploads/${productsFolder}`, express.static(productsPath));

//   app.setGlobalPrefix('api');

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Validation pipes ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // --- Uploads configuration ---
  const uploadsBase = process.env.UPLOADS_PATH!;
  const categoriesFolder = process.env.CATEGORY_UPLOAD_PATH || 'categories';
  const productsFolder = process.env.PRODUCT_UPLOAD_PATH || 'products';

  const categoriesPath = join(uploadsBase, categoriesFolder);
  const productsPath = join(uploadsBase, productsFolder);

  // Ensure folders exist
  [categoriesPath, productsPath].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Serve static files
  app.use(`/uploads/${categoriesFolder}`, express.static(categoriesPath));
  app.use(`/uploads/${productsFolder}`, express.static(productsPath));

  // --- CORS configuration ---
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL,
    ],
    credentials: false, // no tokens needed
  });

  // --- Global prefix ---
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
