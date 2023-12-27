import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { GuildUser, Rank } from '@prisma/client';
import { Client, GuildMember } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';
import { SettingsChanged } from '../guild-settings/events/settings-role-id-changed.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class GuildUserService {
  constructor(
    @Inject(PrismaService) private database: PrismaService,
    @InjectDiscordClient() private client: Client,
    @Inject(GuildSettingsService) private settings: GuildSettingsService,
  ) {}
  async getGuildUser(
    userId: string,
    guildId: string,
  ): Promise<GuildUser | undefined> {
    return this.database.guildUser.findUnique({
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

  async getRank(member: GuildMember): Promise<Rank> {
    if (member.guild.ownerId === member.id) {
      return 'OWNER';
    } else if (await this._isMemberAdmin(member.id, member.guild.id)) {
      return 'ADMIN';
    } else if (await this._isMemberMod(member.id, member.guild.id)) {
      return 'MOD';
    } else if (await this._isMemberVerified(member.id, member.guild.id)) {
      return 'MEMBER';
    } else {
      return 'NEW';
    }
  }
  async addMembers(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    members.forEach(async (member: GuildMember) => {
      if (!member.user.bot) {
        const rank = await this.getRank(member);
        await this.addMember(member.id, member.guild.id, {
          rank: rank,
          unlocked: rank !== 'NEW',
        });
      }
    });
  }
  async addMember(
    userId: string,
    guildId: string,
    data: Omit<Omit<Partial<GuildUser>, 'userId'>, 'guildId'>,
  ) {
    await this.database.user.upsert({
      where: { userId },
      create: { userId },
      update: { userId },
    });
    await this.upsert(userId, guildId, data);
  }

  @OnEvent('settings.role.*.changed')
  async onAdminRoleIdChanged(payload: SettingsChanged) {
    await this.addMembers(payload.guildId);
  }

  private async _isMemberVerified(user_id: string, guild_id: string) {
    return (
      await (await this.client.guilds.fetch(guild_id)).members.fetch(user_id)
    ).roles.cache.has(
      (await this.settings.getVerifiedMemberRoleId(guild_id)).toString(),
    );
  }

  private async _isMemberMod(
    user_id: string,
    guild_id: string,
  ): Promise<boolean> {
    return (
      await (await this.client.guilds.fetch(guild_id)).members.fetch(user_id)
    ).roles.cache.has((await this.settings.getModRoleId(guild_id)).toString());
  }
  private async _isMemberAdmin(
    user_id: string,
    guild_id: string,
  ): Promise<boolean> {
    return (
      await (await this.client.guilds.fetch(guild_id)).members.fetch(user_id)
    ).roles.cache.has(
      (await this.settings.getAdminRoleId(guild_id)).toString(),
    );
  }
}
