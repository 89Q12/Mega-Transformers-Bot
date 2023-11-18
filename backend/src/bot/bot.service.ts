import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseGuildTextChannel, GuildMember, Message } from 'discord.js';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { SettingsService } from 'src/settings/settings.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(PrismaService) private database: PrismaService,
    @Inject(SettingsService) private settings: SettingsService,
    @Inject(UserService) private userService: UserService,
  ) {}

  async isMemberMod(user_id: string, guild_id: string): Promise<boolean> {
    return (
      await this.client.guilds.cache.first().members.fetch(user_id)
    ).roles.cache.some(
      async (role) =>
        role.id === (await this.settings.getModRoleId(guild_id)).toString(),
    );
  }
  async isMemberAdmin(user_id: string, guild_id: string): Promise<boolean> {
    return (
      await this.client.guilds.cache.first().members.fetch(user_id)
    ).roles.cache.some(
      async (role) =>
        role.id === (await this.settings.getAdminRoleId(guild_id)).toString(),
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
      message.guildId,
    );
    // Usable variables:
    // ${user} - username
    // ${message} - message content
    return template
      .replace('${user}', message.author.username)
      .replace('${message}', message.content);
  }

  async crawlMembers(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    members.forEach(async (member: GuildMember) => {
      if (!member.user.bot) {
        await this.userService.findOrCreate(
          member.id,
          member.user.username,
          member.guild.id,
          this.isMemberAdmin(member.id, guildId)
            ? 'ADMIN'
            : this.isMemberMod(member.id, guildId)
            ? 'MOD'
            : 'MEMBER',
        );
      }
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
