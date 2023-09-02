import { Module } from '@nestjs/common';
import { RoleController } from './role/role.controller';
import { UserController } from './user/user.controller';
import { ChannelController } from './channel/channel.controller';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [RoleController, UserController, ChannelController],
  providers: [],
  exports: [],
})
export class ModerationModule {}
