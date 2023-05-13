import { CommandInteractionOptionResolver } from 'discord.js';
import { Event } from '../../lib/Event';
import { CommandType, ExtendedInteraction } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/Client';

// Slashcommands handling
export default new Event('interactionCreate', async (interaction) => {
	// checks if the bot has booted(initialized)
	if (!(interaction.client as ExtendedClient).booted) return;
	// Chat Input Commands TYPE: CHAT_INPUT
	if (interaction.isCommand()) {
		await interaction.deferReply();
		const command = (interaction.client as ExtendedClient).slashCommands.find(
			(cmd) => {
				return (cmd as CommandType).name == interaction.command?.name;
			},
		) as CommandType;
		if (!command)
			return interaction.followUp('You have used a non existent command');
		await command.run({
			interactionOptions:
				interaction.options as CommandInteractionOptionResolver,
			client: interaction.client as ExtendedClient,
			interaction: interaction as ExtendedInteraction,
		});
	}
});
