import { Controller, Get, Inject, Param } from '@nestjs/common';
import { GuildService } from './guild.service';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';

@Controller('/')
export class GuildController {
  constructor(
    @Inject(GuildService) private guildService: GuildService,
    @InjectDiscordClient() private client: Client,
  ) {}

  @Get('messages-per-channel-last-month')
  async messagesPerChannelLastMonth(@Param('guildId') guildId: string) {
    const data = await this.guildService.averageMessagesPerChannelLastMonth(
      guildId,
    );
    const labels = [];
    const values = Object.values(data);
    Object.keys(data).forEach(async (key) => {
      labels.push(
        (await (await this.client.guilds.fetch(guildId)).channels.fetch(key))
          .name,
      );
    });
    return {
      labels,
      values,
    };
  }
  @Get('messages-per-day-last-month')
  async messagesPerDayLastMonth(@Param('guildId') guildId: string) {
    const data = await this.guildService.averageMessagesPerDayLastMonth(
      guildId,
    );
    const labels = [];
    const values = Object.values(data);
    Object.keys(data).forEach((key) => {
      labels.push(key);
    });
    return {
      labels,
      values,
    };
  }
}
