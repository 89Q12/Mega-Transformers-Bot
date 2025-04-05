import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GuildUser } from '@prisma/client';
import {
  BaseGuildTextChannel,
  Client,
  Colors,
  EmbedBuilder,
  GuildTextBasedChannel,
  userMention,
} from 'discord.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserTimeOutEvent } from 'src/guild/moderation/events/user.events';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { CronJob, CronJobParams } from 'cron';
import { GuildService } from 'src/guild/guild.service';
import { PrismaService } from 'src/prisma.service';

const logger = new Logger('TaskService');

/**
 * The tasks service is responsible for managing jobs/tasks that run periodically.
 * It also exposes a way to create tasks but NOT deleting them.
 */
@Injectable()
export class TasksService {
  constructor(
    @Inject(GuildService) private guildService: GuildService,
    @Inject(GuildUserService) private userService: GuildUserService,
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}
  /**
   * A utility function to create cronjobs on the fly from cronjob parameters
   * @param jobOptions CronJob parameters such as the time. onComplete etc
   * @returns a new cronjob
   */
  createDynamicScheduledJob(jobOptions: CronJobParams) {
    return new CronJob(
      jobOptions.cronTime,
      jobOptions.onTick,
      jobOptions.onComplete,
      jobOptions.start,
      jobOptions.timeZone,
    );
  }

  /**
   * Runs at 00:00:00 every day and
   * updates the written messages count for all users, of all guilds the bot is in, that have the MEMBER rank
   * and then updates their permissions on specific channels.
   */
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

  /**
   * Runs every 5 minutes and checks if members of each given guild the bot is in are still timeouted
   */
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
            this.eventEmitter.emit('error', {
              toFormattedLog() {
                return err.toString();
              },
            });
          }
        },
      );
    });
  }

  /**
   * Runs everyday at midnight and kicks members that are longer than 14 days on the server and haven't checked in.
   */
  @Cron('0 0 * * *', {
    name: 'cleanWfpMembers',
    timeZone: 'Europe/Berlin',
  })
  async cleanWfpMembers() {
    const outCome = await this.guildService.cleanWfpMembers(
      '1011511871297302608',
      false,
    );
    const logChannel = (await this.client.channels.fetch(
      '1195024829544411168',
    )) as GuildTextBasedChannel;
    const embed = new EmbedBuilder()
      .setTitle('Daily wfp kick member report')
      .setColor(Colors.Blue)
      .setDescription(
        'Member die kicked wurden bzw. nicht kicked werden konnten',
      )
      .addFields([
        {
          name: 'Kicked members count',
          value: outCome['membersToKick'].length.toString(),
        },
        {
          name: 'Kicked members names',
          value: outCome['membersToKick']
            .map((member) => userMention(member.id))
            .join('\n'),
        },
        {
          name: "Couldn't kick members count",
          value: outCome['unkickableMembers'].length.toString(),
        },
        {
          name: "Couldn't kick members names",
          value: outCome['unkickableMembers']
            .map((member) => userMention(member.id))
            .join('\n'),
        },
      ]);
    await logChannel.send({
      embeds: [embed],
    });
  }

  @Cron('0 0 * * *', {
    name: 'closeStaleTickets',
    timeZone: 'Europe/Berlin',
  })
  async closeStaleTickets() {
    const tickets = await this.prismaService.tickets.findMany();
    tickets.forEach(async (ticket) => {
      try {
        const channel = (await (
          await this.client.guilds.fetch(ticket.guildId)
        ).channels.fetch(ticket.ticketId)) as GuildTextBasedChannel;
        if (
          new Date(new Date().setDate(new Date().getDate() - 7)) >
          new Date(channel.lastMessage.createdTimestamp)
        ) {
          try {
            await (channel as BaseGuildTextChannel).permissionOverwrites.delete(
              ticket.userId,
            );
            await this.prismaService.tickets.update({
              where: {
                ticketId: ticket.ticketId,
              },
              data: {
                closed: true,
              },
            });
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
}
