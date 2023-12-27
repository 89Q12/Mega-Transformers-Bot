import { Inject, Injectable } from '@nestjs/common';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, Guild } from 'discord.js';
import { PrismaService } from '../prisma.service';
import { SelfDto } from './self.dto';
import { User } from '@prisma/client';
import { plainToInstance } from '../util/functions/plain-to-instance';

@Injectable()
export class SelfService {
  constructor(
    @InjectDiscordClient() private readonly discord: Client,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async fetchSelf(userId: User['userId']): Promise<SelfDto> {
    const [discordUser, guilds] = await Promise.all([
      this.discord.users.fetch(userId),
      this._fetchGuilds(userId),
    ]);

    return plainToInstance(SelfDto, {
      userId: discordUser.id,
      avatarUrl: discordUser.avatarURL({ size: 128 }),
      name: discordUser.username,
      guilds: guilds.map((guild) => ({
        guildId: guild.id,
        name: guild.name,
        image: guild.iconURL({ size: 128 }),
      })),
    });
  }

  private async _fetchGuilds(userId: User['userId']): Promise<Guild[]> {
    return this.prisma.guildUser
      .findMany({ where: { userId: userId } })
      .then((guildUsers) =>
        Promise.all(
          guildUsers.map((guildUser) =>
            this.discord.guilds.fetch(guildUser.guildId),
          ),
        ),
      );
  }
}
