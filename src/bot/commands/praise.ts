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

import praise from '../data/praiseImages.json';

import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { Command } from '../lib/Command';

export default new Command({
	name: 'praise',
	description: 'Praise a user',
	usage: '<mention user>',
	isArgumentsRequired: true,
	type: ApplicationCommandTypes.MESSAGE,
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
