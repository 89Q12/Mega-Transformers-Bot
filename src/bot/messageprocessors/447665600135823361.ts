import { Message, TextChannel } from 'discord.js';
import { MessageProcessor } from '../lib/MessageProcessor';
import Util from '../Util';
const DISCORD_INVITE_REGEX =
	/(https)*(http)*:*(\/\/)*discord(.gg|app.com\/invite)\/[a-zA-Z0-9]{1,}/i;
const LINK_REGEX =
	/(ftp|http|https):\/\/(www\.)??[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;

const spamWarnings = new Set();
const textInNoTextWarnings = new Set();
export default new MessageProcessor({
	name: 'spamfilter',
	ignoreCommands: true,
	process: async (message, cleanContent, mentioned) => {
		if (message.member?.permissions.has('MANAGE_MESSAGES')) return;

		if (DISCORD_INVITE_REGEX.test(message.content)) {
			message.delete();
			Util.ban(message, message.author.id, 'Autobanned for invite link');
			return;
		}
		if (
			(message.channel as TextChannel).name.toLowerCase().startsWith('nsfw_')
		) {
			if (
				message.content.toLowerCase().includes('http') ||
				message.attachments.first() ||
				LINK_REGEX.test(message.content)
			)
				return;

			if (textInNoTextWarnings.has(message.author.id)) {
				Util.ban(
					message,
					message.author.id,
					'Autobanned messages hentai channel',
				);
				textInNoTextWarnings.delete(message.author.id);
			} else {
				message.author.send(
					'8. Text other than links is not allowed in hentai channels. If you wish to comment on something in a hentai channel, #media or #meme-machine do so in main chat and reference the channel youre commenting on.This is to prevent unnecessary clutter so people can easily see the content posted in the channels.',
				);
				textInNoTextWarnings.add(message.author.id);
				if (message.deletable) message.delete();
			}
			return;
		}

		if (
			message.content.indexOf('@everyone') > -1 ||
			message.content.indexOf('@here') > -1
		) {
			Util.ban(
				message,
				message.author.id,
				'Autobanned by spam filter: usage of @everyone/@here',
			);
			return;
		}

		if (
			LINK_REGEX.test(message.content) &&
			(message.channel as TextChannel).name.toLowerCase().startsWith('main')
		) {
			if (spamWarnings.has(message.author.id)) {
				Util.ban(message, message.author.id, 'Autobanned for sending links');
				spamWarnings.delete(message.author.id);
			} else {
				message.reply(
					'Please do not send links. This is your one and only warning.\nFailure to comply will result in a ban.',
				);
				spamWarnings.add(message.author.id);
				if (message.deletable) message.delete();
			}
		}

		const previousMessages = message.channel.messages.cache.last(4);

		if (
			previousMessages.length === 4 &&
			(message.channel as TextChannel).name.toLowerCase().startsWith('main') &&
			previousMessages.every((m: Message) => m.author.id === message.author.id)
		)
			if (spamWarnings.has(message.author.id)) {
				Util.ban(message, message.author.id, 'Autobanned message limit');
				spamWarnings.delete(message.author.id);
			} else {
				message.reply(
					'Please keep your messages under 4 messages long. This is your one and only warning.\nFailure to comply will result in a ban.',
				);
				spamWarnings.add(message.author.id);
			}
	},
});
