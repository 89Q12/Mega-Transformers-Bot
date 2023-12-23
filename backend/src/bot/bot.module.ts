import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { PingCommand } from './commands/ping.command';
import { BotGateway } from './bot.gateway';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { SettingsModule } from 'src/guild/settings/settings.module';
import { SettingsService } from 'src/guild/settings/settings.service';
import { TimeOutCommand } from './commands/timeout.command';
import { GuildUserModule } from 'src/guild/guild-user/guild-user.module';
import { GuildModule } from 'src/guild/guild.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    DiscordModule.forFeature(),
    GuildUserModule,
    ConfigModule,
    SettingsModule,
    GuildModule,
    UserModule,
  ],
  providers: [
    BotService,
    PingCommand,
    TimeOutCommand,
    BotGateway,
    PrismaService,
    SettingsService,
  ],
  controllers: [BotController],
  exports: [BotService, DiscordModule],
})
export class BotModule {}
