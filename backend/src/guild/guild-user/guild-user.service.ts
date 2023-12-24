import { Inject, Injectable } from '@nestjs/common';
import { GuildUser } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GuildUserService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}
  async getGuildUser(
    userId: string,
    guildId: string,
  ): Promise<GuildUser | undefined> {
    return await this.database.guildUser.findUnique({
      where: { guildId_userId: { userId, guildId } },
    });
  }

  async upsert(
    userId: string,
    guildId: string,
    data: Omit<Omit<Partial<GuildUser>, 'userId'>, 'guildId'>,
  ): Promise<GuildUser> {
    return await this.database.guildUser.upsert({
      where: { guildId_userId: { userId, guildId } },
      create: { ...data, userId, guildId },
      update: { ...data, userId, guildId },
    });
  }

  async insertMessage(
    userId: string,
    messageId: string,
    channelId: string,
    guildId: string,
  ) {
    await this.database.messages.create({
      data: {
        userId,
        guildId,
        messageId,
        createdAt: new Date(),
        channelId,
      },
    });
  }

  async deleteOne(userId: string, guildId: string): Promise<void> {
    const users = await this.database.guildUser.findMany({
      where: { userId },
    });
    await this.database.guildUser.delete({
      where: { guildId_userId: { userId, guildId } },
    });
    if (users.length === 1) {
      await this.database.user.delete({ where: { userId } });
    }
  }
  async findAll(
    guildId: string | undefined = undefined,
    userId: string | undefined = undefined,
  ): Promise<Array<GuildUser>> {
    const users = await this.database.guildUser.findMany({
      where: { OR: [{ userId }, { guildId }] },
    });
    if (!users) return [];
    return users;
  }

  async updateMessageCountBucket(
    userId: string,
    guildId: string,
  ): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const messageCount = await this.database.messages.count({
      where: {
        AND: {
          userId,
          guildId,
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    await this.database.guildUser.update({
      where: { guildId_userId: { userId, guildId } },
      data: { messageCountBucket: messageCount },
    });
  }
  async isActive(userId: string, guildId: string): Promise<boolean> {
    return (
      (
        await this.database.guildUser.findUnique({
          where: {
            guildId_userId: {
              userId,
              guildId,
            },
          },
        })
      ).messageCountBucket >= 30
    );
  }
}
