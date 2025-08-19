import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad básica
  app.use(helmet());
  app.enableCors({
    origin: '*', // ajústalo luego a tu dominio
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validación global DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // elimina props extra
      forbidNonWhitelisted: false,
      transform: true,       // convierte tipos automáticamente
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('NapaviTruck API')
    .setDescription('Documentación de endpoints v1')
    .setVersion('1.0.0')
    .addBearerAuth() // Authorization: Bearer <token>
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`API escuchando en http://localhost:${port}  |  Swagger: /docs`);
}
bootstrap();
