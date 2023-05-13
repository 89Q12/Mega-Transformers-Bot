import { Message, EmbedBuilder } from 'discord.js';
import { ApplicationCommandType } from 'discord.js';
import { Command } from '../../lib/Command';

export default new Command({
	name: 'kick',
	aliases: ['byebye'],
	description: 'Kick an user',
	usage:
		'userid | mention not limited to one. You can supply a list of ids/mentions',
	type: ApplicationCommandType.Message,
	isArgumentsRequired: true,
	isClass: false,
	guildOnly: true,
	isAdminOnly: true,
	requiredPermissions: ['KICK_MEMBERS'],
	isSlash: false,
	// The ? Operator makes the compiler happy, also message and params will never be undefined because its gets checked before the command is executed.
	// But doing the types like that makes it easier
	run: async (options) => {
		const resArry = new Array<string>();
		const ids = Array<string>();
		options.params?.forEach(async (mention) => {
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
					(await kick(options.message as Message, id)),
			);
		}
		await options.message?.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('#43cc24')
					.setTitle(':white_check_mark: Kick summery.')
					.setDescription(
						`:arrow_right: User${resArry.length > 1 ? 's' : ''}: ${resArry.join(
							' ',
						)}`,
					),
			],
		});
	},
});

async function kick(message: Message, id: string): Promise<string> {
	try {
		await message.guild?.members.kick(
			await message.guild?.members.fetch(id),
			`Kicked by ${message.author.tag}`,
		);
		return 'successfully kicked.\n';
	} catch (error) {
		return 'unsuccessfully kicked.\n';
	}
}
