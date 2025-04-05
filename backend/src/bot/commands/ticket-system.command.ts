import {
  Command,
  Handler,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import {
  ActionRowBuilder,
  ButtonBuilder,
  Client,
  CommandInteraction,
} from 'discord.js';
import { needHelpButton } from 'src/util/functions/menu-helper';

@Command({
  name: 'ticketsystem-setup',
  description: 'Sends a message and attaches the create Ticket button.',
  defaultMemberPermissions: ['Administrator'],
  dmPermission: false,
})
export class PingCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Handler()
  async onTicketsystemSetupCommand(
    @InteractionEvent() interaction: CommandInteraction,
  ) {
    try {
      await interaction.channel.send({
        content:
          'Du hast ein Anliegen welches du mit den Mods besprechen möchtest? Dann erstelle ein Ticket!',
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(needHelpButton()),
        ],
      });
      await interaction.reply({
        ephemeral: true,
        content: 'Done!',
      });
    } catch {
      interaction.reply({
        ephemeral: true,
        content: 'Could not send a message in this channel!',
      });
    }
  }
}
