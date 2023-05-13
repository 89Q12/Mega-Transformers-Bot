import { Command } from '../../lib/Command';
import { ApplicationCommandType } from 'discord.js';

export default new Command({
	name: 'ping',
	description: 'replies with pong',
	type: ApplicationCommandType.ChatInput,
	isSlash: true,
	guildOnly: true,
	isClass: false,
	run: async ({ interaction }) => {
		interaction?.followUp(`Ping: ${interaction?.client.ws.ping * 2}ms`);
	},
});
