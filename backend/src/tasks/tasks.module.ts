import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BotModule } from 'src/bot/bot.module';
import { UserModule } from 'src/users/user.module';

@Module({
  providers: [TasksService],
  imports: [BotModule, UserModule],
})
export class TasksModule {}
