import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ModalSubmitInteraction,
  GuildTextBasedChannel,
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
} from 'discord.js';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import {
  modRequestCategorySelect,
  selectGuildMenu,
} from 'src/util/functions/menu-helper';
@Injectable()
export class ModRequestFlow {
  logger = new Logger(ModRequestFlow.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(GuildUserService)
    private readonly guildUserService: GuildUserService,
  ) {}

  @On('interactionCreate')
  async onModalSubmit(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    const [modal, guildId, categoryId] = interaction.customId.split('-');
    if (modal != 'modRequestModal') return;
    await interaction.deferReply();
    const guild = await this.client.guilds.fetch(guildId);
    const channel = (await guild.channels.fetch(
      // await this.settingsService.getModChannelId(guildId),
      '1023931328787386492',
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
    if (!interaction.isStringSelectMenu()) return;
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
    if (!interaction.isButton()) return;
    if (interaction.customId != 'needHelp') return;
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
      this.logger.error(e);
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
        : (interaction?.guildId ?? guilds[0]);
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
