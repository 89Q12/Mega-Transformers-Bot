import { Inject, Injectable } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, GuildMember, Presence } from 'discord.js';
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
      if (!member.user.bot)
        await this.userService.createOne(
          parseInt(member.id),
          member.user.username,
        );
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    await this.userService.createOne(parseInt(member.id), member.user.username);
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.userService.deleteOne(parseInt(member.id));
  }

  @On('presenceUpdate')
  async presenceUpdate(
    oldMemberPresence: Presence,
    newMemberPresence: Presence,
  ) {
    console.log(oldMemberPresence.status, newMemberPresence.status);
  }
}
