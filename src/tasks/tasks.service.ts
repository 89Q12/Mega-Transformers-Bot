import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { Client } from 'discord.js';
import { BotService } from 'src/bot/bot.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @Inject(BotService) private botService: BotService,
    @Inject(UsersService) private userService: UsersService,
  ) {}

  @Cron('* * 0 * * *', {
    name: 'checkActiveUsers',
    timeZone: 'Europe/Paris',
  })
  async checkActiveUsers() {
    (await this.userService.findAll()).forEach((user: User) => {
      this.userService.updateMessageCountBucket(user);
      if (!this.userService.isActive(user))
        this.botService.markMemberInactive(user);
      else this.botService.markMemberActive(user);
    });
  }
}
