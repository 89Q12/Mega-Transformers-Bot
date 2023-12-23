import { Module } from '@nestjs/common';
import { GuildUserController } from './guild-user/guild-user.controller';
import { SettingsController } from './settings/settings.controller';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';
import { SettingsModule } from './settings/settings.module';
import { ModerationModule } from './moderation/moderation.module';
import { GuildUserModule } from './guild-user/guild-user.module';

@Module({
  imports: [
    DiscordModule.forFeature(),
    GuildUserModule,
    SettingsModule,
    ModerationModule,
  ],
  controllers: [GuildUserController, SettingsController, GuildController],
  providers: [GuildService, PrismaService],
  exports: [GuildService],
})
export class GuildModule {}
