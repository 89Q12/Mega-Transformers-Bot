import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import {
  Client,
  GuildMember,
  GuildTextBasedChannel,
  Message,
} from 'discord.js';
import { UserService } from 'src/user/user.service';
import { MessageFromUserGuard } from './guards/message-from-user.guard';
import { IsUserUnlockedGuard } from './guards/user-is-unlocked.guard';
import { ChannelIdGuard } from './guards/message-in-channel.guard';
import { BotService } from './bot.service';
import { SettingsService } from 'src/settings/settings.service';
@Injectable()
export class BotGateway {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(SettingsService) private readonly settingsService: SettingsService,
    @Inject(BotService) private readonly discordService: BotService,
  ) {}

  @Once('ready')
  async onReady() {
    const settings = await this.settingsService.getSettings(
      this.client.guilds.cache.at(0).id,
    );
    if (!settings) {
      await this.settingsService.createSettings(
        this.client.guilds.cache.at(0).id,
      );
      console.log('Created settings using default values');
    }
    const members = await this.client.guilds.cache.at(0).members.fetch();
    members.forEach(async (member: GuildMember) => {
      const isMod = member.roles.cache.has(
        await this.settingsService.getModRoleId(
          this.client.guilds.cache.at(0).id,
        ),
      );
      const isAdmin = member.roles.cache.has(
        await this.settingsService.getAdminRoleId(
          this.client.guilds.cache.at(0).id,
        ),
      );
      if (!member.user.bot) {
        await this.userService.findOrCreate(
          member.id,
          member.user.username,
          member.guild.id,
          isMod ? 'MOD' : isAdmin ? 'ADMIN' : 'MEMBER',
        );
      }
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    if (member.user.bot) return;
    await this.userService.findOrCreate(
      member.id,
      member.user.username,
      member.guild.id,
      'MEMBER',
    );
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.userService.deleteOne(member.id);
    // remove all roles from user to avoid this: https://canary.discord.com/channels/1011511871297302608/1011527466130608171/1155900698257539202
    // THis probably errors out quite often though
    try {
      await member.roles.remove(member.roles.cache);
    } catch (e) {
      console.log(e);
    }
  }
  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, IsUserUnlockedGuard)
  async onMessage(message: Message): Promise<void> {
    await this.userService.insertMessage(
      message.author.id,
      message.id,
      message.channelId,
      message.guildId,
    );
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, ChannelIdGuard('1121822614374060175'))
  async postIntroductionFromUser(message: Message): Promise<void> {
    // Get first message from user in the introduction channel and post it to the open introduction channel
    const messages = await message.channel.messages.fetch({ limit: 1 });
    const firstMessage = messages.first();
    await this.userService.setFirstMessageId(
      firstMessage.id,
      firstMessage.author.id,
    );
    return;
  }

  @On('guildMemberUpdate')
  //@UseGuards(MessageFromUserGuard)
  async unlockUser(member: GuildMember) {
    // check if wfp has been removed and user role has been added
    if (
      member.roles.cache.has(
        await this.settingsService.getUnverifiedMemberRoleId(member.guild.id),
      ) &&
      !member.roles.cache.has(
        await this.settingsService.getVerifiedMemberRoleId(member.guild.id),
      )
    )
      return;
    await this.userService.unlockUser(member.id);
    // Post introduction message(firstmessage) to open introduction channel
    const stats = await this.userService.getStats(member.id);
    if (stats.firstMessageId) {
      const channel = (await this.client.channels.fetch(
        await this.settingsService.getOpenIntroChannelId(member.guild.id),
      )) as GuildTextBasedChannel;
      const message = await (
        (await this.client.channels.fetch(
          await this.settingsService.getIntroChannelId(member.guild.id),
        )) as GuildTextBasedChannel
      ).messages.fetch(stats.firstMessageId.toString());
      await channel.send(await this.discordService.templateMessage(message));
    }
  }
}
