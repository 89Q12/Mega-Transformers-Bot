import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DiscordModule } from '@discord-nestjs/core';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { GuildService } from 'src/guild/guild.service';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { GuildRestrictedChannelService } from 'src/guild/guild-restricted-channel/guild-restricted-channel.service';

@Module({
  providers: [
    TasksService,
    GuildUserService,
    GuildService,
    PrismaService,
    GuildSettingsService,
    GuildRestrictedChannelService,
  ],
  imports: [DiscordModule.forFeature()],
})
export class TasksModule {}
