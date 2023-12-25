import { Module } from '@nestjs/common';
import { GuildAutoDeleteChannelService } from './guild-auto-delete-channel.service';
import { GuildAutoDeleteChannelController } from './guild-auto-delete-channel.controller';
import { DiscordModule } from '@discord-nestjs/core';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { BotService } from 'src/bot/bot.service';
import { GuildUserService } from '../guild-user/guild-user.service';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    GuildAutoDeleteChannelService,
    PrismaService,
    TasksService,
    BotService,
    GuildUserService,
    GuildSettingsService,
    UserService,
  ],
  controllers: [GuildAutoDeleteChannelController],
  exports: [GuildAutoDeleteChannelService],
})
export class GuildAutoDeleteChannelModule {}
