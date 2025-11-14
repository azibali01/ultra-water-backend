/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Disable built-in CORS to configure manually
  const app = await NestFactory.create(AppModule, { cors: false });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Pos Inventory API')
    .setDescription('The pos-inventory API description')
    .setVersion('1.0')
    .addTag('pos-inv')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  // 🚀 Manual CORS (needed for Render)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://ultra-water-frontend.vercel.app', // your frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 🚀 Fix OPTIONS preflight errors on Render (NestJS + Express)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.options('*', (req: any, res: any) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.send();
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
