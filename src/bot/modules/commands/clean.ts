import { Message, EmbedBuilder, TextChannel, ThreadChannel } from 'discord.js';
import { ApplicationCommandType } from 'discord.js';
import { RunOptions } from '../../interfaces/Command';
import { Command } from '../../lib/Command';
import Util from '../../Util';

export default new Command({
	name: 'clean',
	aliases: ['auto-clean clean'],
	description: 'Cleans a channel.',
	usage: 'clean #mention-channel ',
	missingArgumentsResponse: 'Please mention a channel!',
	type: ApplicationCommandType.Message,
	isArgumentsRequired: true,
	requiredPermissions: ['MANAGE_MESSAGES'],
	isAdminOnly: true,
	isClass: false,
	guildOnly: true,
	isSlash: false,
	// The ? Operator makes the compiler happy, also message and params will never be undefined because its gets checked before the command is executed.
	// But doing the types like that makes it easier
	run: async (options: RunOptions) => {
		const channel = options.message?.mentions.channels.first() as TextChannel | ThreadChannel;
		if (channel === undefined) return;
		await options.message?.channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor('#42d7f4')
					.setTitle('Confirm channel clear.')
					.setDescription(
						'This will **instantly** clean this channel, __without any warning__.\n\nConfirm by sending `yes`. You have 10s to answer.\nSending any other message will cancel the clean',
					),
			],
		});
		const collector = channel?.createMessageCollector({
			filter: (msg: Message) =>
				options.message?.author.id === msg.author.id &&
				msg.content.toLowerCase().includes('yes'),
			time: 10000,
		});
		collector?.on(
			'collect',
			async (msg: Message) => await Util.clean(msg.channel as TextChannel),
		);
	},
});
