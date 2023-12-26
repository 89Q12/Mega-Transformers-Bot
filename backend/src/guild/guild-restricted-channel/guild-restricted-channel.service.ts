import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { GuildUser, RestrictedChannels } from '@prisma/client';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GuildRestrictedChannelService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(PrismaService) private database: PrismaService,
  ) {}
  async getRestrictedChannel(guildId: string, channelId: string) {
    return this.database.restrictedChannels.findUnique({
      where: {
        guildId,
        channelId,
      },
    });
  }
  async upsert(
    guildId: string,
    channelId: string,
    data: Omit<Omit<Partial<RestrictedChannels>, 'guildId'>, 'channelId'>,
  ) {
    return this.database.restrictedChannels.upsert({
      where: {
        channelId,
        guildId,
      },
      create: {
        ...data,
        channelId,
        guildId,
      },
      update: {
        ...data,
        channelId,
        guildId,
      },
    });
  }
  async getAll(guildId: string) {
    return this.database.restrictedChannels.findMany({
      where: {
        guildId,
      },
    });
  }

  async isChannelAvailableToUser(user: GuildUser, channel: RestrictedChannels) {
    return user.messageCountBucket >= channel.requiredPoints;
  }
}
