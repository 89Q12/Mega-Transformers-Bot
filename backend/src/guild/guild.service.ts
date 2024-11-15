import { InjectDiscordClient, Once } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { Guild, GuildUser } from '@prisma/client';
import { Client, BaseGuildTextChannel } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { GuildRestrictedChannelService } from './guild-restricted-channel/guild-restricted-channel.service';

@Injectable()
export class GuildService {
  constructor(
    @Inject(PrismaService) private database: PrismaService,
    @Inject(GuildRestrictedChannelService)
    private restrictedChannelService: GuildRestrictedChannelService,
    @InjectDiscordClient() private client: Client,
  ) {}

  async upsertGuild(guildId: string, data: Omit<Partial<Guild>, 'id'>) {
    return await this.database.guild.upsert({
      where: {
        id: guildId,
      },
      select: {
        AuditLog: true,
        Settings: true,
        AutoDeleteChannels: true,
        RestrictedChannels: true,
        Limits: true,
      },
      create: {
        id: guildId,
        Settings: {
          create: {},
        },
        ...data,
      },
      update: {
        ...data,
      },
    });
  }

  /**
   * Returns the average written messages per channel for last 30 days for the given guild.
   * @returns A map that contains each channel ID and the average written messages
   *
   * SQL:
   *  SELECT
   *   m.channelId,
   *   m.userId,
   *   COUNT(m.messageId) AS messageCount,
   *   AVG(subquery.messageCount) AS avgMessageCount
   * FROM
   *   Message m
   * JOIN
   *   (SELECT channelId, COUNT(messageId) / 30 AS messageCount
   *   FROM Message
   *   WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND guildId = '123'
   *   GROUP BY channelId) AS subquery ON m.channelId = subquery.channelId
   * WHERE
   *   m.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
   * GROUP BY
   *   m.channelId, m.userId
   * ORDER BY
   *  avgMessageCount DESC;
   */
  async averageMessagesPerChannelLastMonth(
    guildId: string,
  ): Promise<Record<string, number>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const messageStats = await this.database.messages.groupBy({
      by: ['channelId', 'userId'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        AND: {
          guildId: guildId,
        },
      },
      _count: {
        messageId: true,
      },
      orderBy: {
        _count: {
          messageId: 'desc',
        },
      },
    });

    const messageCounts: Record<
      string,
      Record<string, number>
    > = messageStats.reduce((acc, curr) => {
      const channelId = curr.channelId.toString();
      const userId = curr.userId.toString();
      const count = curr._count?.messageId ?? 0;

      if (!acc[channelId]) {
        acc[channelId] = {};
      }

      acc[channelId][userId] = count;

      return acc;
    }, {});

    const avgMessageCounts = {};

    for (const channelId in messageCounts) {
      const userCounts = Object.values(messageCounts[channelId]);
      const avgMessageCount =
        userCounts.reduce((sum, count) => sum + count, 0) / userCounts.length;
      avgMessageCounts[channelId] = avgMessageCount;
    }

    return avgMessageCounts;
  }
  /**
   * Returns the average written message per day in the last 30 days per channel
   * @param guildId string
   * @returns
   */
  async averageMessagesPerDayLastMonth(
    guildId: string,
  ): Promise<Record<string, number>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const messageStats = await this.database.messages.groupBy({
      by: 'createdAt',
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        AND: {
          guildId,
        },
      },
      _count: {
        messageId: true,
      },
    });
    const messageCounts: Record<string, number> = messageStats.reduce(
      (acc, curr) => {
        const date = curr.createdAt.toISOString().split('T')[0];
        // sum up all the messages for that day and add it to the accumulator
        acc[date] = (acc[date] ?? 0) + (curr._count?.messageId ?? 0);

        return acc;
      },
      {},
    );

    return messageCounts;
  }

  async updateChannelPermissions(user: GuildUser) {
    this.restrictedChannelService.getAll(user.guildId).then((channels) =>
      channels.forEach((channel) =>
        this.restrictedChannelService
          .isChannelAvailableToUser(user, channel)
          .then((bool) => {
            bool
              ? this._removeMemberFromChannelOverwrite(
                  user.userId.toString(),
                  channel.channelId,
                )
              : this._addMemberToChannelOverwrite(
                  user.userId.toString(),
                  channel.channelId,
                );
          }),
      ),
    );
  }
  private async _addMemberToChannelOverwrite(
    user_id: string,
    channel_id: string,
  ) {
    await (
      (await this.client.channels.fetch(channel_id)) as BaseGuildTextChannel
    ).permissionOverwrites.create(user_id, {
      ViewChannel: false,
      ReadMessageHistory: false,
    });
  }
  private async _removeMemberFromChannelOverwrite(
    user_id: string,
    channel_id: string,
  ) {
    await (
      (await this.client.channels.fetch(channel_id)) as BaseGuildTextChannel
    ).permissionOverwrites.delete(user_id);
  }
  /**
   * Event handler that listens to the ready event which is fired when the bot websocket has been created.
   * Sets up all guilds in the database if they dont already exist there or updates them.
   */
  @Once('ready')
  async onReady() {
    const guilds = await this.client.guilds.fetch();
    guilds.forEach(async (guild) => {
      this.upsertGuild(guild.id, {
        name: guild.name,
      });
    });
  }
}
