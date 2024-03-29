import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GuildDoesNotExistExceptionFilter } from './util/exception/guild-does-not-exist-exception';
import { SendDirectMessageToUserExceptionFilter } from './util/exception/send-direct-message-to-user-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.CORS_ALLOW_ALL) {
    app.enableCors();
  }
  app.useGlobalFilters(
    new GuildDoesNotExistExceptionFilter(),
    new SendDirectMessageToUserExceptionFilter(),
  );
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Mega Transformers Bot')
        .setDescription('Mega Transformers Bot API description')
        .setLicense(
          `Copyright (C) 2023-${new Date().getFullYear()} `,
          'https://github.com/89Q12/discord-bot/blob/main/LICENSE',
        )
        .addBearerAuth({ bearerFormat: 'JWT', type: 'http' })
        .build(),
    ),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}

bootstrap();
