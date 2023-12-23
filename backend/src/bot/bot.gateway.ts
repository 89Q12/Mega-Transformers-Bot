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
import { MessageFromUserGuard } from './guards/message-from-user.guard';
import { IsUserUnlockedGuard } from './guards/user-is-unlocked.guard';
import { ChannelIdGuard } from './guards/message-in-channel.guard';
import { BotService } from './bot.service';
import { SettingsService } from 'src/guild/settings/settings.service';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { Rank } from '@prisma/client';
import { GuildService } from 'src/guild/guild.service';

@Injectable()
export class BotGateway {
  logger = new Logger(BotGateway.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(GuildUserService)
    private readonly guildUserService: GuildUserService,
    @Inject(SettingsService) private readonly settingsService: SettingsService,
    @Inject(BotService) private readonly discordService: BotService,
    @Inject(GuildService) private readonly guildService: GuildService,
  ) {}

  // Runs whenever the discordjs websocket gets recreated
  @On('ready')
  async onReady(): Promise<void | Error> {
    await this.client.guilds.fetch();
    this.client.guilds.cache.forEach(async (guild) => {
      await this.guildService.upsertGuild(guild.id, {
        name: guild.name,
      });
      this.discordService.addMembers(guild.id);
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    this.logger.log(`Adding member ${member.user.username} to database.`);
    if (member.user.bot) return;
    await this.discordService.addMember(member.id, member.guild.id, {
      rank: Rank.NEW,
      unlocked: false,
    });
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.guildUserService.deleteOne(member.id, member.guild.id);
  }
  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, IsUserUnlockedGuard)
  async onMessage(message: Message): Promise<void> {
    await this.guildUserService.insertMessage(
      message.author.id,
      message.id,
      message.channelId,
      message.guildId,
    );
    await this.guildUserService.updateMessageCountBucket(
      message.author.id,
      message.guildId,
    );
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, ChannelIdGuard('1121822614374060175'))
  async postIntroductionFromUser(message: Message): Promise<void> {
    // Get first message from user in the introduction channel and post it to the open introduction channel
    const messages = await message.channel.messages.fetch({ limit: 1 });
    const firstMessage = messages.first();
    await this.guildUserService.upsert(
      firstMessage.author.id,
      message.guildId,
      {
        firstMessageId: firstMessage.id,
      },
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
        (
          await this.guildUserService.getGuildUser(
            userReacted.id,
            reaction.message.guildId,
          )
        ).rank,
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
      (
        await this.guildUserService.getGuildUser(
          reaction.message.author.id,
          reaction.message.guildId,
        )
      ).rank === 'NEW' &&
      reaction.emoji.name === '✅'
    ) {
      console.log('unlocking user');
      await this.guildUserService.upsert(user.id, reaction.message.guildId, {
        unlocked: true,
      });
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
    const oldRank = await this.discordService.getRank(oldMember);
    const newRank = await this.discordService.getRank(newMember);
    if (oldRank === newRank) return;
    this.logger.log(
      `User ${newMember.user.username} has been promoted from ${oldRank} to ${newRank}`,
    );
    await this.guildUserService.upsert(newMember.id, newMember.guild.id, {
      rank: newRank,
    });
  }
}
