import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import {
  ApplicationCommandType,
  CommandInteraction,
  MessageContextMenuCommandInteraction,
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
      interaction.reply({
        content: 'Done!',
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
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
    @IA(SlashCommandPipe, ValidationPipe) dto: ModAnnouncementDto,
  ): Promise<void> {
    try {
      await interaction.channel.send({
        content: dto.message,
        reply: {
          messageReference: interaction.targetMessage.id,
          failIfNotExists: true,
        },
      });
    } catch (err) {
      interaction.reply({
        content: `Failed to send message in this channel with error: ${err} and message:
          ${dto.message}`,
        ephemeral: true,
      });
    }
  }
}
