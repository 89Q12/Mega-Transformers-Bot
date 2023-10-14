import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { PingCommand } from './commands/ping.command';
import { BotGateway } from './bot.gateway';
import { UserModule } from 'src/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [
    DiscordModule.forFeature(),
    UserModule,
    ConfigModule,
    SettingsModule,
  ],
  providers: [BotService, PingCommand, BotGateway, PrismaService],
  controllers: [BotController],
  exports: [BotService, DiscordModule],
})
export class BotModule {}
