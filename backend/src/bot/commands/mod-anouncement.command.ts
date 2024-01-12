import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { ModAnouncementDto } from '../dto/mod-anouncement.dto';
import { SlashCommandPipe, ValidationPipe } from '@discord-nestjs/common';

@Command({
  name: 'mumvoice',
  description: 'Sends your message using the bot',
  defaultMemberPermissions: ['ModerateMembers'],
  type: ApplicationCommandType.ChatInput,
  dmPermission: false,
})
export class MumVoiceCommand {
  @Handler()
  async onMessage(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe) message: ModAnouncementDto,
  ): Promise<void> {
    try {
      await interaction.channel.send(message.message);
      interaction.reply({
        content: 'Done!',
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
        content: `Failed to send message in this channel with error: ${err} and message:
          ${message.message}`,
        ephemeral: true,
      });
    }
  }
}
