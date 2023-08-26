import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Cardinal System')
        .setLicense(
          `Copyright (C) 2023-${new Date().getFullYear()} `,
          'https://github.com/89Q12/discord-bot/blob/main/LICENSE',
        )
        .addBearerAuth({ bearerFormat: 'JWT', type: 'http' })
        .build(),
    ),
  );
  await app.listen(3000);
}
bootstrap();
