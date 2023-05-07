import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { Command } from '../lib/Command';

export default new Command({
	name: 'ping',
	description: 'replies with pong',
	type: ApplicationCommandTypes.CHAT_INPUT,
	isSlash: true,
	guildOnly: true,
	isClass: false,
	run: async ({ interaction }) => {
		interaction?.followUp(`Ping: ${interaction?.client.ws.ping * 2}ms`);
	},
});
