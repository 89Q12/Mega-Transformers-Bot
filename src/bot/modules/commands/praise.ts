import praise from '../data/praiseImages.json';
import { ApplicationCommandType } from 'discord.js';
import { Command } from '../../lib/Command';

export default new Command({
	name: 'praise',
	description: 'Praise a user',
	usage: '<mention user>',
	isArgumentsRequired: true,
	type: ApplicationCommandType.Message,
	isSlash: false,
	isClass: false,
	guildOnly: true,
	run: async function (options) {
		if (!options.message?.mentions.users.size) {
			return options.message?.channel.send('Who do you want me to praise?');
		}
		// Looks weird because all these things can be undefined but at this  point they can't due to various checks beforehand
		options.message?.channel.send(
			options.message?.mentions?.users?.first()?.toString() +
				praise[Math.floor(Math.random() * praise.length)],
		);
	},
});
