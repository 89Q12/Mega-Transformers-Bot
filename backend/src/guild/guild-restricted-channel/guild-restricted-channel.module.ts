import { Module } from '@nestjs/common';
import { GuildRestrictedChannelController } from './guild-restricted-channel.controller';
import { GuildRestrictedChannelService } from './guild-restricted-channel.service';

@Module({
  controllers: [GuildRestrictedChannelController],
  providers: [GuildRestrictedChannelService],
})
export class GuildRestrictedChannelModule {}
