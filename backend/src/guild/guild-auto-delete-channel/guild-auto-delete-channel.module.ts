import { Module } from '@nestjs/common';
import { GuildAutoDeleteChannelService } from './guild-auto-delete-channel.service';
import { GuildAutoDeleteChannelController } from './guild-auto-delete-channel.controller';
import { DiscordModule } from '@discord-nestjs/core';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { GuildService } from '../guild.service';
import { GuildUserService } from '../guild-user/guild-user.service';
import { GuildRestrictedChannelService } from '../guild-restricted-channel/guild-restricted-channel.service';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    GuildAutoDeleteChannelService,
    PrismaService,
    TasksService,
    GuildService,
    GuildUserService,
    GuildRestrictedChannelService,
    GuildSettingsService,
  ],
  controllers: [GuildAutoDeleteChannelController],
  exports: [GuildAutoDeleteChannelService],
})
export class GuildAutoDeleteChannelModule {}
