import { Inject, Injectable } from '@nestjs/common';
import { Once, InjectDiscordClient } from '@discord-nestjs/core';
import { Client, GuildMember, Message } from 'discord.js';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BotGateway {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  @Once('ready')
  async onReady() {
    const members = await this.client.guilds.cache.at(0).members.fetch();
    members.forEach(async (member: GuildMember) => {
      console.log(member.user.username);
      await this.userService.createOne(
        parseInt(member.id),
        member.user.username,
      );
    });
  }
}
