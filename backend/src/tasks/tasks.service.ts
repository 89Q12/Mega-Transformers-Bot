import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GuildUser } from '@prisma/client';
import { Client } from 'discord.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserTimeOutEvent } from 'src/guild/moderation/events/user.events';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { CronJob, CronJobParameters } from 'cron';
import { GuildService } from 'src/guild/guild.service';

const logger = new Logger('TaskService');

@Injectable()
export class TasksService {
  constructor(
    @Inject(GuildService) private guildService: GuildService,
    @Inject(GuildUserService) private userService: GuildUserService,
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  createDynamicScheduledJob(jobOptions: CronJobParameters) {
    return new CronJob(jobOptions);
  }

  @Cron('0 0 * * *', {
    name: 'checkActiveUsers',
    timeZone: 'Europe/Berlin',
  })
  async checkActiveUsers() {
    this.client.guilds.cache.forEach(async (guild) => {
      (await this.userService.findAll(guild.id)).forEach(
        async (user: GuildUser) => {
          if (user.rank != 'MEMBER') return;
          logger.log(`Checking user ${user.userId} for activity...`);
          this.userService.updateMessageCountBucket(user.userId, user.guildId);
          this.guildService.updateChannelPermissions(user);
        },
      );
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
        async (dbUser: GuildUser) => {
          try {
            const member = await this.client.guilds.cache
              .get(guild.id)
              .members.fetch(dbUser.userId.toString());
            if (member.communicationDisabledUntilTimestamp == null) {
              return;
            } else if (
              member.communicationDisabledUntilTimestamp > Date.now()
            ) {
              logger.log(
                `User ${dbUser.userId} is still timed out, until ${new Date(
                  member.communicationDisabledUntilTimestamp,
                ).toLocaleString()}`,
              );
              return;
            } else if (
              member.communicationDisabledUntilTimestamp < Date.now()
            ) {
              logger.log(`User ${dbUser.userId} timeout expired.`);
              await this.eventEmitter.emitAsync(
                'user.timeout.expired',
                new UserTimeOutEvent(member.id, guild.id, 'Timeout expired', 0),
              );
              await member.disableCommunicationUntil(null); // Be sure to really remove the timeout because its already expired
            }
          } catch (err) {
            await this.eventEmitter.emit('error', {
              toFormattedLog() {
                return err.message();
              },
            });
          }
        },
      );
    });
  }
}
