import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { PingCommand } from './commands/ping.command';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { TimeOutCommand } from './commands/timeout.command';
import { MumVoiceCommand } from './commands/mod-anouncement.command';
import { GuildRestrictedChannelService } from 'src/guild/guild-restricted-channel/guild-restricted-channel.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    PingCommand,
    TimeOutCommand,
    MumVoiceCommand,
    PrismaService,
    GuildSettingsService,
    GuildRestrictedChannelService,
  ],
  exports: [DiscordModule],
})
export class BotModule {}
