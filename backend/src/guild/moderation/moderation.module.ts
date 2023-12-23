import { Module } from '@nestjs/common';
import { RoleController } from './role/role.controller';
import { UserController } from './user/user.controller';
import { ChannelController } from './channel/channel.controller';
import { DiscordModule } from '@discord-nestjs/core';
import { AuditLogModule } from 'src/auditlog/auditlog.module';

@Module({
  imports: [DiscordModule.forFeature(), AuditLogModule],
  controllers: [RoleController, UserController, ChannelController],
  providers: [],
  exports: [],
})
export class ModerationModule {}
