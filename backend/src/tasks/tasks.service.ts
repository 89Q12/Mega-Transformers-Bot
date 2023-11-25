import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { Client } from 'discord.js';
import { AuditLogService } from 'src/auditlog/auditlog.service';
import { BotService } from 'src/bot/bot.service';
import LogEntry from 'src/util/dto/log.entry.dto';
import { UserService } from 'src/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserTimeOutEvent } from 'src/moderation/events/user.events';

const logger = new Logger('TaskService');

@Injectable()
export class TasksService {
  constructor(
    @Inject(BotService) private botService: BotService,
    @Inject(UserService) private userService: UserService,
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(AuditLogService) private auditLogService: AuditLogService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron('0 0 * * *', {
    name: 'checkActiveUsers',
    timeZone: 'Europe/Berlin',
  })
  async checkActiveUsers() {
    this.client.guilds.cache.forEach(async (guild) => {
      (await this.userService.findAll(guild.id)).forEach(async (user: User) => {
        if (user.rank != 'MEMBER') return;
        logger.log(`Checking user ${user.userId} for activity...`);
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
          if (member.communicationDisabledUntilTimestamp == null) {
            return;
          } else if (member.communicationDisabledUntilTimestamp > Date.now()) {
            logger.log(`User ${dbUser.userId} is still timed out.`);
            return;
          } else if (member.communicationDisabledUntilTimestamp < Date.now()) {
            logger.log(`User ${dbUser.userId} timeout expired.`);
            await this.eventEmitter.emitAsync(
              'user.timeout.expired',
              new UserTimeOutEvent(member.id, guild.id, 'Timeout expired', 0),
            );
            await member.disableCommunicationUntil(null); // Be sure to really remove the timeout because its already expired
          }
        },
      );
    });
  }
}
