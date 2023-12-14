import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { InjectDiscordClient, On } from '@discord-nestjs/core';
import {
  Client,
  GuildMember,
  GuildTextBasedChannel,
  Message,
  MessageReaction,
  User,
} from 'discord.js';
import { UserService } from 'src/user/user.service';
import { MessageFromUserGuard } from './guards/message-from-user.guard';
import { IsUserUnlockedGuard } from './guards/user-is-unlocked.guard';
import { ChannelIdGuard } from './guards/message-in-channel.guard';
import { BotService } from './bot.service';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class BotGateway {
  logger = new Logger(BotGateway.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(SettingsService) private readonly settingsService: SettingsService,
    @Inject(BotService) private readonly discordService: BotService,
  ) {}

  // Runs whenever the discordjs websocket gets recreated
  @On('ready')
  async onReady(): Promise<void | Error> {
    await this.client.guilds.fetch();
    this.client.guilds.cache.forEach(async (guild) => {
      try {
        await this.settingsService.getSettings(guild.id);
      } catch (e) {
        this.logger.log(
          "Couldn't find settings for guild, not adding users to database",
        );
        this.settingsService.createSettings(guild.id);
      }
      this.discordService.addMembers(guild.id);
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    this.logger.log(`Adding member ${member.user.username} to database.`);
    if (member.user.bot) return;
    await this.userService.upsert(
      member.id,
      member.user.username,
      member.guild.id,
      'NEW',
      false,
    );
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.userService.deleteOne(member.id);
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
    await this.userService.updateMessageCountBucket(
      await this.userService.findOne(message.author.id),
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
  }
  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  async toniMsgsToBird(message: Message): Promise<void> {
    if (message.author.id === '1132244079242133555') {
      message.react('🐦');
    }
  }
  @On('messageReactionAdd')
  async unlockUser(reaction: MessageReaction, userReacted: User) {
    if (reaction.message.channelId != '1121822614374060175') return;
    if (
      !['MOD', 'ADMIN', 'OWNER'].includes(
        (await this.userService.findOne(userReacted.id)).rank,
      )
    )
      return;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        this.logger.error(e);
      }
    }
    const user = reaction.message.author;
    if (
      reaction.message.channelId ==
        (await this.settingsService.getIntroChannelId(
          reaction.message.guildId,
        )) &&
      (await this.userService.findOne(reaction.message.author.id)).rank ===
        'NEW' &&
      reaction.emoji.name === '✅'
    ) {
      console.log('unlocking user');
      await this.userService.unlockUser(user.id);
      const member = await (
        await this.client.guilds.fetch(reaction.message.guildId)
      ).members.fetch(user.id);
      try {
        member.roles.add(
          await this.settingsService.getVerifiedMemberRoleId(
            reaction.message.guildId,
          ),
        );
        // Wait 500ms to make sure the role is added before removing the unverified role
        //https://github.com/discordjs/discord.js/issues/4930#issuecomment-1042351896
        await new Promise((resolve) => setTimeout(resolve, 500));
        member.roles.remove(
          await this.settingsService.getUnverifiedMemberRoleId(
            reaction.message.guildId,
          ),
        );
      } catch (e) {
        this.logger.error(e);
      }
      const channel = (await reaction.message.guild.channels.fetch(
        await this.settingsService.getOpenIntroChannelId(
          reaction.message.guildId,
        ),
      )) as GuildTextBasedChannel;
      await channel.send(
        await this.discordService.templateMessage(
          reaction.message as Message<true>,
        ),
      );
      await reaction.remove();
    }
  }

  @On('guildMemberUpdate')
  async updateRank(oldMember: GuildMember, newMember: GuildMember) {
    // check if user has been promoted to mod or admin
    if (
      !oldMember.roles.cache.has(
        await this.settingsService.getModRoleId(oldMember.guild.id),
      ) &&
      newMember.roles.cache.has(
        await this.settingsService.getModRoleId(newMember.guild.id),
      )
    ) {
      await this.userService.setRank(newMember.id, 'MOD');
    } else if (
      !oldMember.roles.cache.has(
        await this.settingsService.getAdminRoleId(oldMember.guild.id),
      ) &&
      newMember.roles.cache.has(
        await this.settingsService.getAdminRoleId(newMember.guild.id),
      )
    ) {
      await this.userService.setRank(newMember.id, 'ADMIN');
    }
  }
}
