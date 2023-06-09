import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { BaseGuildTextChannel, GuildTextBasedChannel } from 'discord.js';
import {
  Client,
  GuildBasedChannel,
  PermissionOverwrites,
  TextChannel,
} from 'discord.js';

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async markMemberInactive(user: User) {
    this._addMemberToChannel(
      user.user_id.toString(),
      this.configService.get<string>(''),
    );
  }
  async markMemberActive(user: User) {
    this._addMemberToChannel(
      user.user_id.toString(),
      this.configService.get<string>(''),
    );
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
}
