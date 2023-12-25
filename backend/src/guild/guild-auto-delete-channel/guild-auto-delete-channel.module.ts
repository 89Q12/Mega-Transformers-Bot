import { Module } from '@nestjs/common';
import { GuildAutoDeleteChannelService } from './guild-auto-delete-channel.service';
import { GuildAutoDeleteChannelController } from './guild-auto-delete-channel.controller';

@Module({
  providers: [GuildAutoDeleteChannelService],
  controllers: [GuildAutoDeleteChannelController],
})
export class GuildAutoDeleteChannelModule {}
