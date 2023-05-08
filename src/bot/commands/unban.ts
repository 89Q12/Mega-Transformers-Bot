import { Message, EmbedBuilder } from 'discord.js';
import { ApplicationCommandType } from 'discord.js';
import { BanImages } from '../entities';
import { Command } from '../lib/Command';

export default new Command({
	name: 'unban',
	aliases: ['unban'],
	description: 'unbans an user',
	usage:
		'userid | mention not limited to one. You can supply a list of ids/mentions',
	type: ApplicationCommandType.Message,
	isArgumentsRequired: true,
	isClass: false,
	guildOnly: true,
	isAdminOnly: true,
	requiredPermissions: ['BAN_MEMBERS'],
	isSlash: false,
	// The ? Operator makes the compiler happy, also message and params will never be undefined because its gets checked before the command is executed.
	// But doing the types like that makes it easier
	run: async (options) => {
		const resArry = new Array<string>();
		const ids = Array<string>();
		const image = await options.client.orm.em.getRepository(BanImages).findOne({
			gid: options.client.guildID,
			banner: options.message?.author.id,
		});
		options.params?.forEach((mention) => {
			if (
				mention.startsWith('<@') &&
				mention.endsWith('>') &&
				isNaN(parseInt(mention))
			) {
				mention = mention.slice(2, -1);

				if (mention.startsWith('!')) {
					ids.push(mention);
				}
			} else if (!isNaN(parseInt(mention))) {
				ids.push(mention);
			}
		});
		for await (const id of ids) {
			resArry.push(
				'<@!' +
					id +
					'> has been ' +
					(await unban(options.message as Message, id)),
			);
		}
		const embed = new EmbedBuilder()
			.setColor('#43cc24')
			.setTitle(':white_check_mark: unban summery.')
			.setDescription(
				`:arrow_right: User${resArry.length > 1 ? 's' : ''}: ${resArry.join(
					' ',
				)}`,
			)
			.setFooter({
				text: `Requested by${options.message?.author.tag}`,
				iconURL: options.message?.author.avatarURL() || '',
			})
			.setImage(image?.image || options.client.config.ban.defaultImage);
		await options.message?.reply({
			embeds: [embed],
		});
	},
});

async function unban(message: Message, id: string): Promise<string> {
	try {
		await message.guild?.bans.remove(id);
		return 'successfully unbanned.\n';
	} catch (error) {
		return 'unsuccessfully unbanned.\n';
	}
}
