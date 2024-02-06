import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { PingCommand } from './commands/ping.command';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { TimeOutCommand } from './commands/timeout.command';
import { MumVoiceCommand } from './commands/mod-anouncement.command';
import { GuildRestrictedChannelService } from 'src/guild/guild-restricted-channel/guild-restricted-channel.service';
import { CommunityQuestionCommand } from './commands/community-question.command';
import { initGuildCommand } from './commands/init-guild.command';
import { UserInfoUiCommand } from './commands/user-info-ui.command';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    PingCommand,
    TimeOutCommand,
    MumVoiceCommand,
    CommunityQuestionCommand,
    initGuildCommand,
    PrismaService,
    GuildSettingsService,
    GuildRestrictedChannelService,
    UserInfoUiCommand,
  ],
  exports: [DiscordModule],
})
export class BotModule {}
