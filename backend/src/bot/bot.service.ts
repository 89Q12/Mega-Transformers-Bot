import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseGuildTextChannel, Message } from 'discord.js';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(PrismaService) private database: PrismaService,
    @Inject(SettingsService) private settings: SettingsService,
  ) {}

  async isMemberMod(user: User): Promise<boolean> {
    return (
      await this.client.guilds.cache
        .first()
        .members.fetch(user.userId.toString())
    ).roles.cache.some(
      async (role) =>
        role.id ===
        (await this.settings.getModRoleId(user.guildId.toString())).toString(),
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
        ).messageCountBucket,
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
        ).messageCountBucket,
      )
    ).forEach((channel_id) => {
      this._addMemberToChannel(user.userId.toString(), channel_id);
    });
  }

  async templateMessage(message: Message): Promise<string> {
    // template message using the template string provided in the settings
    const template = await this.settings.getWelcomeMessageFormat(
      message.guild.id,
    );
    // Useable variables:
    // ${user} - username
    // ${message} - message content
    return template
      .replace('${user}', message.author.username)
      .replace('${message}', message.content);
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
