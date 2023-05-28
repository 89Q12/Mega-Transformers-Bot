import { Message, EmbedBuilder, TextChannel, User } from 'discord.js';
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
		reason: 'Cleaning by BOT.',
	});

	await channel.delete();
	await n.setPosition(pos);
	const embed = new EmbedBuilder()
		.setImage(
			'https://vignette3.wikia.nocookie.net/futurediary/images/9/94/Mirai_Nikki_-_06_-_Large_05.jpg',
		)
		.setColor('#ff51ff');
	embed.setAuthor( {
		name: 'BOT is done cleaning.',
		iconURL: n.client.user?.avatarURL() ?? '',
	});
	await n.send({ embeds: [embed] });
}
async function warnChannel(
	channel: TextChannel,
	client: ExtendedClient,
	minutes: number,
) {
	const embed = new EmbedBuilder()
		.setImage(
			'https://vignette3.wikia.nocookie.net/futurediary/images/9/94/Mirai_Nikki_-_06_-_Large_05.jpg',
		)
		.setColor('#ff51ff');
	embed.setAuthor({
		name:
			'BOT is going to clean this channel in ' +
			minutes +
			' minutes. Speak now or forever hold your peace.',
	});
	channel.send({ embeds: [embed] });
}
async function getChannelByName(
	client: ExtendedClient,
	name: string,
): Promise<TextChannel | undefined> {
	const chan = (
		await client.guilds.cache.get(client.guildID)?.channels.fetch()
	)?.filter((chan) => chan?.name == name);
	return (chan?.first() as TextChannel) ?? undefined;
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
	getChannelByName,
	ban,
};
