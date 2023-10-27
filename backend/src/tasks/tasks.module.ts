import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BotModule } from 'src/bot/bot.module';
import { UserModule } from 'src/user/user.module';
import { DiscordModule } from '@discord-nestjs/core';
import { AuditLogModule } from 'src/auditlog/auditlog.module';

@Module({
  providers: [TasksService],
  imports: [BotModule, UserModule, DiscordModule.forFeature(), AuditLogModule],
})
export class TasksModule {}
