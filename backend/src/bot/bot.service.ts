import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { Rank, User } from '@prisma/client';
import { BaseGuildTextChannel, GuildMember, Message } from 'discord.js';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { SettingsService } from 'src/settings/settings.service';
import { UserService } from 'src/user/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingsChanged } from 'src/settings/events/settings-role-id-changed.event';
@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(PrismaService) private database: PrismaService,
    @Inject(SettingsService) private settings: SettingsService,
    @Inject(UserService) private userService: UserService,
  ) {}

  async getRank(member: GuildMember): Promise<Rank> {
    if (await this._isMemberAdmin(member.id, member.guild.id)) {
      return 'ADMIN';
    } else if (await this._isMemberMod(member.id, member.guild.id)) {
      return 'MOD';
    } else if (await this._isMemberVerified(member.id, member.guild.id)) {
      return 'MEMBER';
    } else {
      return 'NEW';
    }
  }
  private async _isMemberVerified(user_id: string, guild_id: string) {
    return (
      await this.client.guilds.cache.first().members.fetch(user_id)
    ).roles.cache.has(
      (await this.settings.getVerifiedMemberRoleId(guild_id)).toString(),
    );
  }
  private async _isMemberMod(
    user_id: string,
    guild_id: string,
  ): Promise<boolean> {
    return (
      await this.client.guilds.cache.first().members.fetch(user_id)
    ).roles.cache.has((await this.settings.getModRoleId(guild_id)).toString());
  }
  private async _isMemberAdmin(
    user_id: string,
    guild_id: string,
  ): Promise<boolean> {
    return (
      await this.client.guilds.cache.first().members.fetch(user_id)
    ).roles.cache.has(
      (await this.settings.getAdminRoleId(guild_id)).toString(),
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
      this._addMemberToChannelOverwrite(user.userId.toString(), channel_id);
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
      this._removeMemberFromChannelOverwrite(
        user.userId.toString(),
        channel_id,
      );
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

  async addMembers(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    members.forEach(async (member: GuildMember) => {
      if (!member.user.bot) {
        const rank = await this.getRank(member);
        await this.userService.upsert(
          member.id,
          member.user.username,
          member.guild.id,
          rank,
          rank !== 'NEW',
        );
      }
    });
  }
  @OnEvent('settings.role.*.changed')
  async onAdminRoleIdChanged(payload: SettingsChanged) {
    await this.addMembers(payload.guildId);
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
