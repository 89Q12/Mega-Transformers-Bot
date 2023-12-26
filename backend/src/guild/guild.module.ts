import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';
import { GuildSettingsModule } from './guild-settings/guild-settings.module';
import { ModerationModule } from './moderation/moderation.module';
import { GuildUserModule } from './guild-user/guild-user.module';
import { GuildAutoDeleteChannelModule } from './guild-auto-delete-channel/guild-auto-delete-channel.module';
import { GuildRestrictedChannelModule } from './guild-restricted-channel/guild-restricted-channel.module';
import { GuildRestrictedChannelService } from './guild-restricted-channel/guild-restricted-channel.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    GuildUserModule,
    GuildSettingsModule,
    ModerationModule,
    GuildAutoDeleteChannelModule,
    GuildRestrictedChannelModule,
  ],
  controllers: [GuildController],
  providers: [GuildService, PrismaService, GuildRestrictedChannelService],
  exports: [GuildService],
})
export class GuildModule {}
