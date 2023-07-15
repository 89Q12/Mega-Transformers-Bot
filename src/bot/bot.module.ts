import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { PingCommand } from './commands/ping.command';
import { BotGateway } from './bot.gateway';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [DiscordModule.forFeature(), UserModule],
  providers: [BotService, PingCommand, BotGateway],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule {}
