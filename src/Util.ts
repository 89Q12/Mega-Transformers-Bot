import { Message, MessageEmbed, TextChannel, User } from 'discord.js';
import { Job, scheduleJob, RecurrenceRule, JobCallback } from 'node-schedule';
import { ExtendedClient } from './interfaces/Client';

function getAvatarURL(user: User) {
	return typeof user.avatar === 'string'
		? 'https://cdn.discordapp.com/avatars/' +
				user.id +
				'/' +
				user.avatar +
				'.png'
		: 'https://cdn.discordapp.com/embed/avatars/' +
				(parseInt(user.discriminator) % 5) +
				'.png';
}
async function clean(channel: TextChannel) {
	const nsfw = channel.nsfw,
		pos = channel.position;

	const n = await channel.clone({
		nsfw: nsfw,
		reason: 'Cleaning by Yuno.',
	});

	await channel.delete();
	await n.setPosition(pos);
	const embed = new MessageEmbed()
		.setImage(
			'https://vignette3.wikia.nocookie.net/futurediary/images/9/94/Mirai_Nikki_-_06_-_Large_05.jpg',
		)
		.setColor('#ff51ff');
	embed.author = {
		name: 'Yuno is done cleaning.',
		iconURL: n.client.user?.avatarURL() ?? '',
	};
	await n.send({ embeds: [embed] });
}
async function warnChannel(
	channel: TextChannel,
	client: ExtendedClient,
	minutes: number,
) {
	const embed = new MessageEmbed()
		.setImage(
			'https://vignette3.wikia.nocookie.net/futurediary/images/9/94/Mirai_Nikki_-_06_-_Large_05.jpg',
		)
		.setColor('#ff51ff');
	embed.author = {
		name:
			'Yuno is going to clean this channel in ' +
			minutes +
			' minutes. Speak now or forever hold your peace.',
	};
	channel.send({ embeds: [embed] });
}
async function getChannelByName(
	client: ExtendedClient,
	name: string,
): Promise<TextChannel | undefined> {
	const chan = (
		await client.guilds.cache.get(client.guildID)?.channels.fetch()
	)?.filter((chan) => chan.name == name);
	return (chan?.first() as TextChannel) ?? undefined;
}
function produceWarnJob(
	hour: number,
	minute: number,
	name: string,
	callback: JobCallback,
): Job {
	const rule: RecurrenceRule = new RecurrenceRule();
	rule.hour = hour == 0 ? 23 : hour - 1;
	rule.minute = 60 - minute;
	rule.tz = 'Etc/UTC';
	return scheduleJob(name + '_warn', rule, callback);
}
function produceCleanJob(
	hour: number,
	name: string,
	callback: JobCallback,
): Job {
	const rule: RecurrenceRule = new RecurrenceRule();
	rule.hour = hour == 24 ? 0 : hour;
	rule.tz = 'Etc/UTC';
	return scheduleJob(name + '_clean', rule, callback);
}
async function ban(
	message: Message,
	id: string,
	reason: string | undefined,
): Promise<string> {
	try {
		await message.guild?.bans.create(id, {
			reason: reason ? reason : `Banned by ${message.author.tag}`,
		});
		return 'successfully banned.\n';
	} catch (error) {
		(message.client as ExtendedClient).emit('error', error as Error);
		return 'unsuccessfully banned.\n';
	}
}
export default {
	getAvatarURL,
	clean,
	warnChannel,
	produceWarnJob,
	produceCleanJob,
	getChannelByName,
	ban,
};
