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

import { EntityRepository } from '@mikro-orm/core';
import { TextChannel, MessageEmbed } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { Channelcleans } from '../entities/Channelcleans';
import { Command } from '../lib/Command';
import { ExtendedClient } from '../interfaces/Client';
import { CommandType, RunOptions } from '../interfaces/Command';

interface dataObj {
	ChannelRepository: EntityRepository<Channelcleans>;
	mentionedChannel: TextChannel | undefined;
	dbChannel: Channelcleans | null;
	timeBetweenCleaning: number;
	warningTime: number;
	msg?: string;
}
class AutoClean extends Command {
	constructor(commandOptions: CommandType) {
		super(commandOptions);
	}
	//Add channel to cleaning list
	async add(options: RunOptions) {
		const {
			ChannelRepository,
			mentionedChannel,
			timeBetweenCleaning,
			warningTime,
			msg,
		} = await getArgs(options);
		if (msg) return await options.message?.reply(msg);
		ChannelRepository.persist(
			ChannelRepository.create({
				gid: options.message?.guildId,
				cname: (mentionedChannel as TextChannel).name,
				cleantime: timeBetweenCleaning.toString(),
				warningtime: warningTime.toString(),
				remainingtime: 0,
			}),
		);
		await ChannelRepository.flush().then(async () => {
			await (options.client as ExtendedClient).registerCleaningJobs();
		});
		await options.message?.channel.send(
			buildReturnMessageAddEdited(
				(mentionedChannel as TextChannel).id,
				timeBetweenCleaning,
				warningTime,
			),
		);
		return;
	}
	// removes a channel from the cleaning list
	async remove(options: RunOptions) {
		const { dbChannel, ChannelRepository, msg } = await getArgs(options);
		if (msg) return await options.message?.reply(msg);
		if (dbChannel == null)
			return options.message?.channel.send(
				":negative_squared_cross_mark: This channel doesn't have any auto-clean set up",
			);
		ChannelRepository.removeAndFlush(dbChannel);
		options.client.channelsToClean
			.get((options.message?.channel as TextChannel).name + '_warn')
			?.cancel();
		options.client.channelsToClean
			.get((options.message?.channel as TextChannel).name + '_clean')
			?.cancel();
		return await options.message?.channel.send(
			':white_check_mark: The auto-clean has been removed.',
		);
	}
	async delay(options: RunOptions) {
		await this.remove(options);
		await this.add(options);
	}
	async edit(options: RunOptions) {
		const {
			dbChannel,
			ChannelRepository,
			timeBetweenCleaning,
			warningTime,
			msg,
		} = await getArgs(options);
		if (msg) return await options.message?.reply(msg);
		if (dbChannel == null)
			return options.message?.channel.send(
				":negative_squared_cross_mark: This channel doesn't have any auto-clean set up",
			);
		ChannelRepository.persistAndFlush(
			ChannelRepository.create({
				gid: dbChannel.gid,
				cname: dbChannel.cname,
				cleantime: timeBetweenCleaning.toString(),
				warningtime: warningTime.toString(),
				remainingtime: 0,
			}),
		);
		return await options.message?.channel.send(
			buildReturnMessageAddEdited(
				(options.message?.channel as TextChannel).id,
				timeBetweenCleaning,
				warningTime,
			),
		);
	}
	async list(options: RunOptions) {
		if (options.params?.at(0) === undefined) {
			const { dbChannel } = await getArgs(options);
			if (dbChannel == null)
				return (options.message?.channel as TextChannel).send(
					":negative_squared_cross_mark: This channel doesn't have any auto-clean set up",
				); // Can't be null would have been caught above before executing this function
			await (options.message?.channel as TextChannel).send({
				embeds: [
					new MessageEmbed()
						.setColor('#ff51ff')
						.setTitle(
							'#' +
								(options.message?.channel as TextChannel).name +
								' auto-clean configuration.',
						)
						.addField('Cleaned at hour:', dbChannel.cleantime, true)
						.addField(
							'Warning thrown',
							dbChannel.warningtime + ' minutes before clean',
							true,
						),
				],
			});
		} else {
			const chan = await options.client.orm.em
				.getRepository(Channelcleans)
				.findAll()
				.then((chan) => chan.map((channel) => channel.cname));

			return await (options.message?.channel as TextChannel).send({
				embeds: [
					new MessageEmbed()
						.setColor('#ff51ff')
						.setTitle('Channels having an auto-clean:')
						.setDescription(
							chan.length ? '``` ' + chan.join(',') + ' ```' : 'None.',
						),
				],
			});
		}
	}
}

export default new AutoClean({
	name: 'auto-clean',
	description:
		'Adds an auto-clean for a channel.\nadd is to add a new auto-clean\nremove to delete an auto-clean\nedit to change the delays of an auto-clean\nreset to reset the counter of an a.-c.\nlist to lists all the actives auto-cleans',
	usage:
		'<add | remove | edit | reset | delay | list> [#channel | all] [time between cleans in hours | time in minutes to add (delay)] [time for the warning before the clean in minutes, number]',
	aliases: ['autoclean'],
	isArgumentsRequired: true,
	isAdminOnly: true,
	guildOnly: true,
	isClass: true,
	missingArgumentsResponse:
		':negative_squared_cross_mark: Not enough arguments.',
	type: ApplicationCommandTypes.MESSAGE,
	subCmdsName: ['add', 'remove', 'edit', 'list'],
	isSlash: false,
	run: async function (options) {
		// It cant be a DM as the bot doesn't in DM'S with this command
		return await options.message?.channel.send(this.usage ?? '');
	},
});
async function getArgs(options: RunOptions): Promise<dataObj> {
	let msg;
	const ChannelRepository = options.client.orm.em.getRepository(Channelcleans);
	const mentionedChannel = options.message?.mentions.channels.first();
	const channel = options.message?.channel as TextChannel;
	const dbChannel = await ChannelRepository.findOneOrFail({
		cname: (mentionedChannel as TextChannel).name,
		gid: channel.guild.id,
	}).catch((err) => {
		options.client.emit('error', err as Error);
		msg = (err as Error).message + '\n';
		return null;
	});

	const timeBetweenCleaning = parseInt(options.params?.at(1) as string);
	const warningTime = parseInt(options.params?.at(2) as string);
	if (mentionedChannel == undefined) msg = 'Please mention a channel';
	if (
		timeBetweenCleaning > 24 ||
		timeBetweenCleaning < 0 ||
		isNaN(timeBetweenCleaning)
	)
		msg += `${timeBetweenCleaning} is not a valid hour\n`;
	if (warningTime > 60 || warningTime < 0 || isNaN(warningTime))
		msg = `${warningTime} is not a valid minute\n`;
	return {
		ChannelRepository,
		mentionedChannel: mentionedChannel as TextChannel,
		dbChannel,
		timeBetweenCleaning,
		warningTime,
		msg,
	};
}

function buildReturnMessageAddEdited(
	chid: string,
	betweenCleans: number,
	beforeWarning: number,
): string {
	return (
		'<#' +
		chid +
		'> will be cleaned every ' +
		betweenCleans +
		' hours and a warning will be thrown ' +
		beforeWarning +
		' minutes before.'
	);
}
