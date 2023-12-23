import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async findOneUser(userId: string): Promise<User | undefined> {
    return await this.database.user.findUnique({
      where: { userId },
    });
  }

  async upsert(userId: string): Promise<User> {
    return await this.database.user.upsert({
      where: { userId },
      create: { userId },
      update: { userId },
    });
  }

  // SELECT
  //   m.channelId,
  //   m.userId,
  //   COUNT(m.messageId) AS messageCount,
  //   AVG(subquery.messageCount) AS avgMessageCount
  // FROM
  //   Message m
  // JOIN
  //   (SELECT channelId, COUNT(messageId) / 30 AS messageCount
  //   FROM Message
  //   WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND guildId = '123'
  //   GROUP BY channelId) AS subquery ON m.channelId = subquery.channelId
  // WHERE
  //   m.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  // GROUP BY
  //   m.channelId, m.userId
  // ORDER BY
  //   avgMessageCount DESC;
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
}
