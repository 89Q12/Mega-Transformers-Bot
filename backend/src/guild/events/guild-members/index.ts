import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { Rank } from '@prisma/client';
import {
  Client,
  GuildMember,
  MessageReaction,
  GuildTextBasedChannel,
  Message,
  User,
} from 'discord.js';
import { ReactedMemberIsModOrHigherGuard } from 'src/bot/guards/member-is-mod-or-higher.guard';
import { ReactionChannelIdGuard } from 'src/bot/guards/reaction-in-channel.guard';
import { ReactionEmoteGuard } from 'src/bot/guards/reaction-emote.guard';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { GuildService } from 'src/guild/guild.service';
import { PrismaService } from 'src/prisma.service';
import { JsonArray } from 'type-fest';

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
    @Inject(PrismaService) private database: PrismaService,
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
  @UseGuards(
    ReactionChannelIdGuard('1121822614374060175'),

    ReactionEmoteGuard(['✅', '☑️']),
    ReactedMemberIsModOrHigherGuard,
  )
  async unlockUser(reaction: MessageReaction) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        this.logger.error(e);
        return;
      }
    }
    const user = await this.guildUserService.getGuildUser(
      reaction.message.author.id,
      reaction.message.guildId,
    );
    if (!user && user.rank !== Rank.NEW) return;
    await this.guildUserService.upsert(user.userId, reaction.message.guildId, {
      unlocked: true,
      firstMessageId: reaction.message.id,
    });
    const member = await (
      await this.client.guilds.fetch(reaction.message.guildId)
    ).members.fetch(user.userId);
    try {
      if (!member.roles.cache.has('1226585753253843014'))
        throw 'Has not accepted AGB';
      const verifiedRoleId = await this.settingsService.getVerifiedMemberRoleId(
        reaction.message.guildId,
      );
      await member.roles.add(verifiedRoleId);
      if (reaction.emoji.name === '☑️')
        await member.roles.add('1014066383912439809');
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

  @On('messageReactionAdd')
  @UseGuards(
    ReactionChannelIdGuard('1226574989147508746'),
    ReactionEmoteGuard(['👍']),
  )
  async checkIfPersonWasVerifiedBefore(reaction: MessageReaction, user: User) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        this.logger.error(e);
        return;
      }
    }
    const dbUser = await this.database.guildUser.findUnique({
      where: {
        guildId_userId: { guildId: reaction.message.guildId, userId: user.id },
      },
    });
    const discordUser = await this.client.guilds.cache
      .get(dbUser.guildId)
      .members.fetch(user.id);
    if (!dbUser && discordUser.roles.cache.has('1121823930085285938')) {
      const roles = (
        await this.database.lockdownRoleBackup.findUnique({
          where: {
            guildId_userId: { guildId: dbUser.guildId, userId: user.id },
          },
        })
      ).roles as JsonArray;
      if (!roles) return;
      // Tyep system gets a bit iffy here :/
      roles.forEach(
        async (role: { id: string }) => await discordUser.roles.add(role.id),
      );
      await discordUser.roles.remove('1121823930085285938');
      await this.database.lockdownRoleBackup.delete({
        where: { guildId_userId: { userId: user.id, guildId: dbUser.guildId } },
      });
    }
  }
}
