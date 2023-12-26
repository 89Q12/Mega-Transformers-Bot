import { Module } from '@nestjs/common';
import { GuildUserController } from './guild-user.controller';
import { GuildUserService } from './guild-user.service';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [GuildUserController],
  providers: [GuildUserService, PrismaService, GuildSettingsService],
  exports: [GuildUserService],
})
export class GuildUserModule {}
