import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { privateDecrypt } from 'crypto';
import { BaseGuildTextChannel } from 'discord.js';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(PrismaService) private database: PrismaService,
    @Inject(ConfigService) private config: ConfigService,
  ) {}

  async isMemberMod(user: User): Promise<boolean> {
    return (
      await this.client.guilds.cache
        .first()
        .members.fetch(user.userId.toString())
    ).roles.cache.some(
      (role) => role.name === this.config.get<string>('MODS_ROLE_NAME'),
    );
  }

  async updateChannelPermissions(user: User) {
    (
      await this._getLockedChannels(
        (
          await this.database.stats.findUnique({
            where: {
              userId: user.userId,
            },
          })
        ).message_count_bucket,
      )
    ).forEach((channel_id) => {
      this._removeMemberToChannel(user.userId.toString(), channel_id);
    });
    (
      await this._getUnlockedChannels(
        (
          await this.database.stats.findUnique({
            where: {
              userId: user.userId,
            },
          })
        ).message_count_bucket,
      )
    ).forEach((channel_id) => {
      this._addMemberToChannel(user.userId.toString(), channel_id);
    });
  }
  private async _addMemberToChannel(user_id: string, channel_id: string) {
    await (
      (await this.client.channels.fetch(channel_id)) as BaseGuildTextChannel
    ).permissionOverwrites.create(user_id, {
      ViewChannel: false,
      ReadMessageHistory: false,
    });
  }
  private async _removeMemberToChannel(user_id: string, channel_id: string) {
    await (
      (await this.client.channels.fetch(channel_id)) as BaseGuildTextChannel
    ).permissionOverwrites.delete(user_id);
  }
  private async _getUnlockedChannels(
    activityCount: number,
  ): Promise<Array<string>> {
    const channels = await this.database.ristrictedChannels.findMany({
      where: {
        requiredPoints: {
          lte: activityCount,
        },
      },
    });
    return channels.map((channel) => channel.channelId.toString());
  }
  private async _getLockedChannels(
    activityCount: number,
  ): Promise<Array<string>> {
    const channels = await this.database.ristrictedChannels.findMany({
      where: {
        requiredPoints: {
          gt: activityCount,
        },
      },
    });
    return channels.map((channel) => channel.channelId.toString());
  }
}
