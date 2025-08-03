import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { PingCommand } from './commands/ping.command';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { TimeOutCommand } from './commands/timeout.command';
import {
  MumVoiceCommandChatInput,
  MumVoiceCommandUi,
} from './commands/mod-anouncement.command';
import { GuildRestrictedChannelService } from 'src/guild/guild-restricted-channel/guild-restricted-channel.service';
import { CommunityQuestionCommand } from './commands/community-question.command';
import { initGuildCommand } from './commands/init-guild.command';
import { UserInfoUiCommand } from './commands/user-info-ui.command';
import { SetFirstMessageUICommand } from './commands/user-set-first-message-ui.command';
import { CleanWfpMember } from './commands/clean-wfp.command';
import { GuildService } from 'src/guild/guild.service';
import { SpecialCommand } from './commands/special.command';
import { TicketSystemSetupCommand } from './commands/ticket-system.command';
import { PurgeCommand } from './commands/purge-user.command';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    PingCommand,
    TimeOutCommand,
    MumVoiceCommandChatInput,
    CommunityQuestionCommand,
    initGuildCommand,
    PrismaService,
    GuildSettingsService,
    GuildRestrictedChannelService,
    UserInfoUiCommand,
    SetFirstMessageUICommand,
    CleanWfpMember,
    GuildService,
    SpecialCommand,
    TicketSystemSetupCommand,
    MumVoiceCommandUi,
    PurgeCommand,
  ],
  exports: [DiscordModule],
})
export class BotModule {}
