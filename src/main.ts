/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Disable default CORS to add our own
  const app = await NestFactory.create(AppModule, { cors: false });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Pos Inventory API')
    .setDescription('The pos-inventory API description')
    .setVersion('1.0')
    .addTag('pos-inv')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  // 🚀 Dynamic CORS - works for both local and production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000',
        'https://ultra-water-frontend.vercel.app',
      ];

      // In development, allow all localhost origins
      if (isDevelopment && origin.includes('localhost')) {
        return callback(null, true);
      }

      // In production or development, check allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject unknown origins
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // 🚀 Preflight handler for all OPTIONS requests
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;

    // Always set CORS headers for all requests
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
