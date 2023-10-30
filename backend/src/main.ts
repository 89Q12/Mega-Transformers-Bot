import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.CORS_ALLOW_ALL) {
    app.enableCors();
  }
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Cardinal System')
        .setDescription('Cardinal System API description')
        .setLicense(
          `Copyright (C) 2023-${new Date().getFullYear()} `,
          'https://github.com/89Q12/discord-bot/blob/main/LICENSE',
        )
        .addBearerAuth({ bearerFormat: 'JWT', type: 'http' })
        .build(),
    ),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
