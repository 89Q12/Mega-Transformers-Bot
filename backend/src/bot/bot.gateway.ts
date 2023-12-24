import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { InjectDiscordClient, On } from '@discord-nestjs/core';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  Client,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  GuildTextBasedChannel,
  Message,
  MessageReaction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
  User,
  userMention,
} from 'discord.js';
import { MessageFromUserGuard } from './guards/message-from-user.guard';
import { IsUserUnlockedGuard } from './guards/user-is-unlocked.guard';
import { ChannelIdGuard } from './guards/message-in-channel.guard';
import { BotService } from './bot.service';
import { SettingsService } from 'src/guild/settings/settings.service';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { Rank } from '@prisma/client';
import { GuildService } from 'src/guild/guild.service';
import { MessageIsDmGuard } from './guards/message-is-dm.guard';

import {
  modRequestCategorySelect,
  needHelpButton,
  selectGuildMenu,
} from 'src/util/functions/menu-helper';
import { retry } from 'rxjs';

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

  @On('messageCreate')
  @UseGuards(MessageIsDmGuard)
  async dmMessageToModTeam(message: Message): Promise<void> {
    try {
      await message.reply({
        content:
          'Ich bin zwar nur ein Bot und kann kein Koverstionen führen, aber ich kann dir helfen. Klicke auf den Button, um Hilfe zu bekommen.',
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(needHelpButton()),
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }

  @On('interactionCreate')
  async onModalSubmit(interaction: ModalSubmitInteraction) {
    if (!(interaction instanceof ModalSubmitInteraction)) return;
    await interaction.deferReply();
    const [modal, guildId, categoryId] = interaction.customId.split('-');
    console.log(modal, guildId, categoryId);
    if (modal != 'modRequestModal') return;
    const guild = await this.client.guilds.fetch(guildId);
    const channel = (await guild.channels.fetch(
      // await this.settingsService.getModChannelId(guildId),
      '1187816730731499651',
    )) as GuildTextBasedChannel;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Mod Anfrage')
          .setDescription(
            interaction.fields.getTextInputValue('modRequestMessage'),
          )
          .addFields(
            {
              name: 'Kategorie',
              value: categoryId.replace('modRequest', ''),
            },
            {
              name: 'Von Nutzer:in',
              value: userMention(interaction.user.id),
            },
          ),
      ],
    });
    await interaction.editReply(
      'Deine Mod Anfrage wurde erfolgreich versendet.',
    );
    await interaction.deleteReply();
  }

  @On('interactionCreate')
  async onMenuSelect(interaction: StringSelectMenuInteraction) {
    if (!(interaction instanceof StringSelectMenuInteraction)) return;
    if (interaction.customId != 'modRequestMenu') return;
    const modRequestModal = new ModalBuilder()
      .setCustomId(
        `modRequestModal-${
          interaction.guildId ?? interaction.values[0].split('-')[1]
        }-${interaction.values[0].split('-')[0]}`,
      )
      .setTitle('Mod Anfrage');

    modRequestModal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('modRequestMessage')
          .setPlaceholder('Schreibe deine Mod Anfrage hier rein.')
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph)
          .setLabel('Mod Anfrage'),
      ),
    );
    await interaction.showModal(modRequestModal);
    await interaction.deleteReply();
  }

  @On('interactionCreate')
  async onButton(interaction: ButtonInteraction) {
    if (!(interaction instanceof ButtonInteraction)) return;
    enum knownButtons {
      'needHelp',
    }
    const callback: Record<
      keyof typeof knownButtons,
      (interaction: ButtonInteraction) => Promise<void>
    > = {
      needHelp: async (i) => {
        this.initiateModRequestFlow(i);
      },
    };
    try {
      callback[interaction.customId as keyof typeof knownButtons](interaction);
    } catch (e) {
      console.log(e);
    }
  }

  async initiateModRequestFlow(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const guilds = (
      await this.guildUserService.findAll(
        interaction?.guildId ?? undefined,
        interaction.user.id,
      )
    ).map((user) => user.guildId);
    const guildId =
      guilds.length > 1
        ? await this._getGuildIdFromSelectMenu(interaction, guilds)
        : interaction?.guildId ?? guilds[0];
    const modRequestMenu = modRequestCategorySelect(guildId);
    const options = {
      content: 'Wähle eine Kategorie aus:',
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          modRequestMenu,
        ),
      ],
      ephemeral: true,
    };
    await interaction.editReply(options);
  }
  async _getGuildIdFromSelectMenu(
    interaction: ButtonInteraction,
    guilds: string[],
  ) {
    const guildMenu = selectGuildMenu(guilds);
    const options = {
      content: 'Wähle einen Server aus:',
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          guildMenu,
        ),
      ],
      ephemeral: true,
    };
    const selectionInteraction = await interaction.editReply(options);
    const selection = await selectionInteraction.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.customId === 'selectGuild',
      time: 1000 * 60 * 5,
    });
    return selection.values[0];
  }
}
