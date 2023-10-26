import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BotModule } from 'src/bot/bot.module';
import { UserModule } from 'src/users/user.module';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  providers: [TasksService],
  imports: [BotModule, UserModule, DiscordModule.forFeature()],
})
export class TasksModule {}
