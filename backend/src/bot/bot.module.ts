import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { PingCommand } from './commands/ping.command';
import { BotGateway } from './bot.gateway';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { SettingsModule } from 'src/settings/settings.module';
import { SettingsService } from 'src/settings/settings.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    UserModule,
    ConfigModule,
    SettingsModule,
  ],
  providers: [
    BotService,
    PingCommand,
    BotGateway,
    PrismaService,
    SettingsService,
  ],
  controllers: [BotController],
  exports: [BotService, DiscordModule],
})
export class BotModule {}
