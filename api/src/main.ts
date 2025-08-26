import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS: permite web local y lo que declares en .env (CORS_ORIGINS)
  const allowed =
    (process.env.CORS_ORIGINS ??
      'http://localhost:3001,http://127.0.0.1:3001')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

  app.enableCors({
    origin(origin, cb) {
      // permitir llamadas sin origen (Swagger/Postman/Expo)
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  // Servir archivos estáticos (fotos y PDF)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('NapaviTruck API')
    .setDescription('API NapaviTruck - auth RUT+PIN y SUPERADMIN empresas')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.PORT || 3000);
  console.log(`API escuchando en http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
