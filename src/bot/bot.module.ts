import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { PingCommand } from './commands/ping.command';
import { BotGateway } from './bot.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DiscordModule.forFeature(), UsersModule],
  providers: [BotService, PingCommand, BotGateway],
  controllers: [BotController],
})
export class BotModule {}
