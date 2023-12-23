import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Client, CommandInteraction } from 'discord.js';
import { ModAnouncementDto } from '../dto/mod-anouncement.dto';
import { SlashCommandPipe, ValidationPipe } from '@discord-nestjs/common';

@Command({
  name: 'mumvoice',
  description: 'Sends your message using the bot',
  defaultMemberPermissions: ['ModerateMembers'],
})
export class MumVoice {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  @Handler()
  async onMessage(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe) message: ModAnouncementDto,
  ): Promise<void> {
    await interaction.deleteReply();
    try {
      await interaction.channel.send(message.message);
    } catch (err) {
      interaction.followUp({
        content: `Failed to send message in this channel with error: ${err} and message:
          ${message.message}`,
        ephemeral: true,
      });
    }
  }
}
