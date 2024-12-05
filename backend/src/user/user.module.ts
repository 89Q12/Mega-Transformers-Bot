import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';
import { SelfController } from './self.controller';
import { SelfService } from './self.service';

/**
 * The user module, not to be confused the guildUser module,
 * is used to manage the bot local user of a discord user.
 * See user.service.ts and self.controller.ts for more info
 */
@Module({
  imports: [DiscordModule.forFeature()],
  providers: [PrismaService, SelfService],
  controllers: [SelfController],
  exports: [SelfService],
})
export class UserModule {}
