/*
    BOT Gasai. A Discord.JS based bot, with multiple features.
    Copyright (C) 2018 Maeeen <maeeennn@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { MessageEmbed } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { Command } from '../lib/Command';
import ballResponse from '../data/ballResponses.json';

export default new Command({
	name: '8ball',
	aliases: ['eightBall'],
	description: 'Use the magic 8 ball',
	usage: 'how is the weather today?',
	type: ApplicationCommandTypes.MESSAGE,
	isArgumentsRequired: true,
	isClass: false,
	guildOnly: true,
	isSlash: false,
	// The ? Operator makes the compiler happy, also message and params will never be undefined because its gets checked before the command is executed.
	// But doing the types like that makes it easier
	run: async (options) => {
		if (options.params?.at(-1)?.endsWith('?')) {
			const result = `${
				ballResponse[Math.floor(Math.random() * ballResponse.length)]
			}`;
			options.message?.channel.send({
				embeds: [
					new MessageEmbed()
						.setTitle('🎱 Magic 8 Ball 🎱')
						.setDescription(result)
						.setColor(0x000000),
				],
			});
		} else {
			options.message?.channel.send(
				'Was that a question? Try asking again with a question mark at the end.',
			);
		}
	},
});
