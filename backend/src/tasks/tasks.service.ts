import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { Client } from 'discord.js';
import { BotService } from 'src/bot/bot.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    @Inject(BotService) private botService: BotService,
    @Inject(UserService) private userService: UserService,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Cron('0 0 * * *', {
    name: 'checkActiveUsers',
    timeZone: 'Europe/Berlin',
  })
  async checkActiveUsers() {
    this.client.guilds.cache.forEach(async (guild) => {
      (await this.userService.findAll(guild.id)).forEach(async (user: User) => {
        if (user.rank != ('MEMBER' || 'NEW')) return;
        this.userService.updateMessageCountBucket(user);
        this.botService.updateChannelPermissions(user);
      });
    });
  }

  // Run every 5 minutes
  @Cron('*/5 * * * *', {
    name: 'timeouts',
    timeZone: 'Europe/Berlin',
  })
  async checkTimeouts() {
    this.client.guilds.cache.forEach(async (guild) => {
      (await this.userService.findAll(guild.id)).forEach(
        async (dbUser: User) => {
          const member = await this.client.guilds.cache
            .get(guild.id)
            .members.fetch(dbUser.userId.toString());
          if (member.communicationDisabledUntilTimestamp > Date.now()) {
            return;
          } else {
            // ADD AUDIT LOG ENTRY
          }
        },
      );
    });
  }
}
