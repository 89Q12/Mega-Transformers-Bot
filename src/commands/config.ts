/*
    Yuno Gasai. A Discord.JS based bot, with multiple features.
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
import { Collection, Message, MessageEmbed } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { CommandType, RunOptions } from '../interfaces/Command';
import { Command } from '../lib/Command';
class Config extends Command {
	constructor(commandOptions: CommandType) {
		super(commandOptions);
	}
	async addmasteruser(options: RunOptions) {
		if (options.params?.at(0) == undefined)
			return options.message?.reply(
				(this as CommandType).missingArgumentsResponse ?? '',
			);
		if (
			!options.client.config.commands.admins.includes(
				options.params?.at(0) as string,
			)
		)
			return options.message?.reply('User is already a masteruser ');
		options.client.config.commands.admins.push(options.params?.at(0) as string);
		options.message?.reply('User added to masterusers');
	}
	async delmasteruser(options: RunOptions) {
		if (options.params?.at(0) == undefined)
			return options.message?.reply(
				(this as CommandType).missingArgumentsResponse ?? '',
			);
		if (
			options.client.config.commands.admins.includes(
				options.params?.at(0) as string,
			)
		) {
			options.client.config.commands.admins.slice(
				options.client.config.commands.admins.indexOf(
					options.params?.at(0) as string,
				),
			);
			options.message?.reply('User added to masterusers');
		} else {
			return options.message?.reply('User was not a masteruser');
		}
	}
	async addmentionresponse(options: RunOptions) {
		const collector = options.message?.channel?.createMessageCollector({
			filter: (msg: Message) => options.message?.author.id === msg.author.id,
			time: 20000,
			max: 2,
		});
		options.message?.reply(
			'Please enter a trigger and a response each in a own message also if you wish you can also provide a gif/img, just send the url. You got 20 seconds to do so.',
		);
		collector?.on('collect', (msg: Message) => {
			msg.reply('Sentence received');
		});
		collector?.on('end', (collected: Collection<string, Message>) => {
			options.message?.channel.send('Collection ended lets see what you wrote');

			options.message?.channel.send({
				embeds: [
					new MessageEmbed()
						.setTitle(':white_check_mark: Mention response added.')
						.addField('Trigger', trigger, true)
						.addField('Response', response, true)
						.addField(
							'Image',
							typeof image === 'string' ? image : 'None.',
							true,
						)
						.setColor('#43cc24'),
				],
			});
		});
	}
	// async delmentionresponse(options: RunOptions) {}
	// async setbanimage(options: RunOptions) {}
	// async delbanimage(options: RunOptions) {}
	// async setexperiencecounter(options: RunOptions) {}
	// async delexperiencecounter(options: RunOptions) {}
	// async setjoinmessage(options: RunOptions) {}
	// async deljoinmessage(options: RunOptions) {}
	// async setlevelrolemap(options: RunOptions) {}
	// async dellevelrolemap(options: RunOptions) {}
	// async setprefix(options: RunOptions) {}
	// async setlevel(options: RunOptions) {}
}
export default new Config({
	name: 'config',
	description: 'Command to manage the configuration of the bot on the fly',
	usage: 'subcommand args, refer to subcommand for further usage',
	aliases: ['config', 'cg'],
	isArgumentsRequired: true,
	isAdminOnly: true,
	guildOnly: true,
	isClass: true,
	missingArgumentsResponse:
		':negative_squared_cross_mark: Not enough arguments.',
	type: ApplicationCommandTypes.MESSAGE,
	subCmdsName: [
		'add-masteruser',
		'del-masteruser',
		'add-mentionresponse',
		'del-mentionresponse',
		'set-banimage',
		'del-banimage',
		'set-experiencecounter',
		'del-experiencecounter',
		'set-joinmessage',
		'del-joinmessage',
		'set-level',
		'set-levelrolemap',
		'del-levelrolemap',
		'set-prefix',
	],
	isSlash: false,
	run: async function (options) {
		return await options.message?.channel.send(
			this.usage +
				'\n Followering subcommand are available\n' +
				this.subCmdsName?.join(' '),
		);
	},
});
