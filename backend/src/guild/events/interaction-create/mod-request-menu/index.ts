import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Inject, Logger } from '@nestjs/common';
import { BinaryToTextEncoding, createHash } from 'crypto';
import {
  ModalSubmitInteraction,
  EmbedBuilder,
  userMention,
  StringSelectMenuInteraction,
  ModalBuilder,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonInteraction,
  StringSelectMenuBuilder,
  ComponentType,
  Client,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  BaseGuildTextChannel,
} from 'discord.js';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { PrismaService } from 'src/prisma.service';
import {
  modRequestCategorySelect,
  modRequestMenuId,
  needHelpButtonId,
  selectGuildMenu,
} from 'src/util/functions/menu-helper';
export class ModRequestFlow {
  logger = new Logger(ModRequestFlow.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(GuildUserService)
    private readonly guildUserService: GuildUserService,
    @Inject(PrismaService) readonly prismaService: PrismaService,
  ) {}

  @On('interactionCreate')
  async onModalSubmit(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    const [modal, guildId, categoryId] = interaction.customId.split('-');
    if (modal != 'modRequestModal') return;
    await interaction.deferReply({
      ephemeral: true,
    });
    const guild = await this.client.guilds.fetch(guildId);
    const channel = await guild.channels.create({
      name: `Ticket-${createHash('sha256')
        .update(
          JSON.stringify(
            interaction.user.displayName + new Date().getUTCDate(),
          ),
          'utf8',
        )
        .digest('hex' as BinaryToTextEncoding)
        .slice(0, 63)}`,
      reason: `${userMention(interaction.user.id)} created a ticket`,
      type: ChannelType.GuildText,
      parent: '1011532621412577350',
      permissionOverwrites: [
        {
          id: '1011511871297302608',
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.AttachFiles,
          ],
        },
        {
          id: '1011513775054143632',
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AddReactions,
          ],
        },
      ],
    });
    const ticket = await this.prismaService.tickets.create({
      data: {
        userId: interaction.user.id,
        guildId,
        ticketId: channel.id,
      },
    });
    await channel.send({
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
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`closeTicket-${ticket.ticketId}`)
            .setLabel('Ticket schließen')
            .setStyle(ButtonStyle.Primary),
        ),
      ],
    });
    await channel.send(userMention(interaction.user.id));
    await channel.send('<@&1405801201316003891>');
    await interaction.editReply({
      content: 'Deine Mod Anfrage wurde erfolgreich versendet.',
    });
  }

  @On('interactionCreate')
  async onMenuSelect(interaction: StringSelectMenuInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId != modRequestMenuId) return;
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
  async onButtonCloseTicket(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('closeTicket')) return;
    const ticketId = interaction.customId.split('-')[1];
    try {
      const ticket = await this.prismaService.tickets.findUnique({
        where: {
          ticketId,
        },
      });
      if (ticket.closed) {
        return interaction.reply('Das Ticket ist schon geschlossen!');
      }
      await this.prismaService.tickets.update({
        where: {
          ticketId,
        },
        data: {
          closed: true,
        },
      });
      const channel = (await this.client.guilds.cache
        .get(ticket.guildId)
        .channels.fetch(ticketId)) as BaseGuildTextChannel;
      await channel.permissionOverwrites.delete(ticket.userId);
      await channel.permissionOverwrites.delete('1011513775054143632');
      await channel.setParent('1014456370860404756');
      return interaction.reply({
        content: 'Ticket geschlossen',
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
  @On('interactionCreate')
  async onButtonNeedHelpButton(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (interaction.customId != needHelpButtonId) return;
    try {
      this.initiateModRequestFlow(interaction);
    } catch (e) {
      this.logger.error(e);
    }
  }
  async initiateModRequestFlow(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    let guildId = '';
    if (!interaction.guildId) {
      const guilds = (
        await this.guildUserService.findAll(undefined, interaction.user.id)
      ).map((user) => user.guildId);
      guildId =
        guilds.length > 1
          ? await this._getGuildIdFromSelectMenu(interaction, guilds)
          : guilds[0];
    } else {
      guildId = interaction.guildId;
    }
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
    const guildMenu = selectGuildMenu(guilds, this.client);
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
