import { Module } from '@nestjs/common';
import { GuildUserController } from './guild-user/guild-user.controller';
import { GuildSettingsController } from './guild-settings/guild-settings.controller';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';
import { GuildSettingsModule } from './guild-settings/guild-settings.module';
import { ModerationModule } from './moderation/moderation.module';
import { GuildUserModule } from './guild-user/guild-user.module';
import { GuildAutoDeleteChannelModule } from './guild-auto-delete-channel/guild-auto-delete-channel.module';
import { GuildRestrictedChannelModule } from './guild-restricted-channel/guild-restricted-channel.module';

@Module({
  imports: [
    DiscordModule.forFeature(),
    GuildUserModule,
    GuildSettingsModule,
    ModerationModule,
    GuildAutoDeleteChannelModule,
    GuildRestrictedChannelModule,
  ],
  controllers: [GuildUserController, GuildSettingsController, GuildController],
  providers: [GuildService, PrismaService],
  exports: [GuildService],
})
export class GuildModule {}
