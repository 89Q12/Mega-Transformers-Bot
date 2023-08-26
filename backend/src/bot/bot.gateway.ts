import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, GuildMember, Message } from 'discord.js';
import { UserService } from 'src/users/user.service';
import { MessageFromUserGuard } from './guards/message-from-user.guard';
@Injectable()
export class BotGateway {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Once('ready')
  async onReady() {
    const members = await this.client.guilds.cache.at(0).members.fetch();
    members.forEach(async (member: GuildMember) => {
      if (!member.user.bot)
        await this.userService.findOrCreate(
          parseInt(member.id),
          member.user.username,
        );
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    await this.userService.findOrCreate(
      parseInt(member.id),
      member.user.username,
    );
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.userService.deleteOne(parseInt(member.id));
  }
  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  async onMessage(message: Message): Promise<void> {
    await this.userService.insertMessage(
      parseInt(message.author.id),
      parseInt(message.id),
      parseInt(message.guildId),
    );
  }
}
