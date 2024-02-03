import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Rank } from '@prisma/client';
import {
  Client,
  GuildMember,
  MessageReaction,
  User,
  GuildTextBasedChannel,
  Message,
} from 'discord.js';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { GuildService } from 'src/guild/guild.service';

@Injectable()
export class GuildMemberEvents {
  logger = new Logger(GuildMemberEvents.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(GuildUserService)
    private readonly guildUserService: GuildUserService,
    @Inject(GuildSettingsService)
    private readonly settingsService: GuildSettingsService,
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
      this.guildUserService.addMembers(guild.id);
    });
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    this.logger.log(`Adding member ${member.user.username} to database.`);
    if (member.user.bot) return;
    await this.guildUserService.addMember(member.id, member.guild.id, {
      rank: Rank.NEW,
      unlocked: false,
    });
  }

  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    await this.guildUserService.deleteOne(member.id, member.guild.id);
  }

  @On('messageReactionAdd')
  async unlockUser(reaction: MessageReaction, userReacted: User) {
    if (
      reaction.message.channelId ==
      (await this.settingsService.getIntroChannelId(reaction.message.guildId))
    )
      return;
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
      (
        await this.guildUserService.getGuildUser(
          reaction.message.author.id,
          reaction.message.guildId,
        )
      ).rank === 'NEW' &&
      reaction.emoji.name === '✅'
    ) {
      await this.guildUserService.upsert(user.id, reaction.message.guildId, {
        unlocked: true,
      });
      const member = await (
        await this.client.guilds.fetch(reaction.message.guildId)
      ).members.fetch(user.id);
      try {
        await member.roles.add(
          await this.settingsService.getVerifiedMemberRoleId(
            reaction.message.guildId,
          ),
        );
        // Wait 500ms to make sure the role is added before removing the unverified role
        //https://github.com/discordjs/discord.js/issues/4930#issuecomment-1042351896
        await new Promise((resolve) => setTimeout(resolve, 500));
        await member.roles.remove(
          await this.settingsService.getUnverifiedMemberRoleId(
            reaction.message.guildId,
          ),
        );
      } catch (e) {
        this.logger.error(e);
        return;
      }
      const channel = (await reaction.message.guild.channels.fetch(
        await this.settingsService.getOpenIntroChannelId(
          reaction.message.guildId,
        ),
      )) as GuildTextBasedChannel;
      await channel.send(
        await this.settingsService.templateMessage(
          reaction.message as Message<true>,
        ),
      );
      await reaction.remove();
    }
  }

  @On('guildMemberUpdate')
  async updateRank(oldMember: GuildMember, newMember: GuildMember) {
    // check if user has been promoted to mod or admin
    const oldRank = await this.guildUserService.getRank(oldMember);
    const newRank = await this.guildUserService.getRank(newMember);
    if (oldRank === newRank) return;
    this.logger.log(
      `User ${newMember.user.username} has been promoted from ${oldRank} to ${newRank}`,
    );
    await this.guildUserService.upsert(newMember.id, newMember.guild.id, {
      rank: newRank,
    });
  }
}
