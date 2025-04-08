import {
  Command,
  Handler,
  IA,
  InteractionEvent,
  On,
} from '@discord-nestjs/core';
import {
  ActionRowBuilder,
  ApplicationCommandType,
  CommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { ModAnnouncementDto } from '../dto/mod-anouncement.dto';
import { SlashCommandPipe, ValidationPipe } from '@discord-nestjs/common';

@Command({
  name: 'mumvoice',
  description: 'Sends your message using the bot',
  defaultMemberPermissions: ['ModerateMembers'],
  type: ApplicationCommandType.ChatInput,
  dmPermission: false,
})
export class MumVoiceCommandChatInput {
  @Handler()
  async onMessage(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe) dto: ModAnnouncementDto,
  ): Promise<void> {
    try {
      if (dto.replyToMessage != '' || dto.replyToMessage != undefined)
        await interaction.channel.send({
          content: dto.message,
          reply: {
            messageReference: dto.replyToMessage,
            failIfNotExists: true,
          },
        });
      else
        await interaction.channel.send({
          content: dto.message,
        });
      interaction.followUp({
        content: 'Done!',
        ephemeral: true,
      });
    } catch (err) {
      interaction.followUp({
        content: `Failed to send message in this channel with error: ${err} and message:
          ${dto.message}`,
        ephemeral: true,
      });
    }
  }
}

@Command({
  name: 'mumvoiceui',
  defaultMemberPermissions: ['ModerateMembers'],
  type: ApplicationCommandType.Message,
})
export class MumVoiceCommandUi {
  @Handler()
  async onMessage(
    @InteractionEvent() interaction: MessageContextMenuCommandInteraction,
  ): Promise<void> {
    try {
      const modAnnouncementModal = new ModalBuilder()
        .setCustomId(`mumvoiceui-${interaction.targetMessage.id}`)
        .setTitle('Nutze Mumvoice auf die ausgewählte Nachricht!')
        .addComponents(
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('modMessage')
              .setPlaceholder(
                'Schreibe hier rein warum du diese Nachricht "Mumvoicen" willst.',
              )
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph)
              .setLabel('Mod Ansage :3'),
          ),
        );
      await interaction.showModal(modAnnouncementModal);
    } catch (err) {
      interaction.reply({
        content: `Failed to show Dialog: ${err}`,
        ephemeral: true,
      });
    }
  }
  @On('interactionCreate')
  async onModalSubmit(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    const [modal, messageId] = interaction.customId.split('-');
    if (modal != 'mumvoiceui') return;
    await interaction.deferReply({
      ephemeral: true,
    });
    const modMessage = interaction.fields.getTextInputValue('modMessage');
    try {
      await interaction.channel.send({
        content: modMessage,
        reply: {
          messageReference: messageId,
          failIfNotExists: true,
        },
      });
      interaction.reply('Done');
    } catch (err) {
      interaction.reply({
        content: `Failed to send message in this channel with error: ${err} and message:
          ${modMessage}`,
        ephemeral: true,
      });
    }
  }
}
