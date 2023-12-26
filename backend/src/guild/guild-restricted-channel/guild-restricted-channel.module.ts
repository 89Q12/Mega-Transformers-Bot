import { Module } from '@nestjs/common';
import { GuildRestrictedChannelController } from './guild-restricted-channel.controller';
import { GuildRestrictedChannelService } from './guild-restricted-channel.service';
import { DiscordModule } from '@discord-nestjs/core';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [GuildRestrictedChannelController],
  providers: [GuildRestrictedChannelService, PrismaService],
  exports: [GuildRestrictedChannelService],
})
export class GuildRestrictedChannelModule {}
