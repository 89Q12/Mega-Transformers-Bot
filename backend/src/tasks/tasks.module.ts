import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BotModule } from 'src/bot/bot.module';
import { DiscordModule } from '@discord-nestjs/core';
import { AuditLogModule } from 'src/auditlog/auditlog.module';
import { GuildUserModule } from 'src/guild/guild-user/guild-user.module';

@Module({
  providers: [TasksService],
  imports: [
    BotModule,
    GuildUserModule,
    DiscordModule.forFeature(),
    AuditLogModule,
  ],
})
export class TasksModule {}
