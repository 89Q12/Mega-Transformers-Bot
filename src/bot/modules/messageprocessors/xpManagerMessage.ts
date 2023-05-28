import { Experiences } from '../../entities';
import { ExtendedClient } from '../../interfaces/Client';
import { MessageProcessor } from '../../lib/MessageProcessor';

export default new MessageProcessor({
	name: 'xpManager',
	ignoreCommands: true,
	process: async (message) => {
		const client: ExtendedClient = message.client as ExtendedClient; // shorthand for message.client
		const rolemap = client.settings.levelRoleMap;
		const xpPerMsg = client.config.chat.xpPerMsg || 1;
		const xpRepository = client.orm.em.getRepository(Experiences);
		// Now we can add xp to the author
		const xpForUser = await xpRepository.findOne({
			guildID: message.guildId,
			userID: message.author.id,
		});
		if (!xpForUser) {
			return xpRepository.persistAndFlush(
				xpRepository.create({
					exp: xpPerMsg,
					guildID: message.guildId!,
					level: '0',
					userID: message.author.id,
				}),
			);
		}
		const neededXP =
			5 * Math.pow(parseInt(xpForUser.level), 2) +
			50 * parseInt(xpForUser.level) +
			100;
		xpForUser.exp += xpPerMsg;

		if (xpForUser.exp >= neededXP) {
			xpForUser.level += 1;
			xpForUser.exp -= neededXP;
		}
		await xpRepository.persistAndFlush(xpForUser);
		if (rolemap[xpForUser.level] !== 'string')
			return console.log('ROle not there');
		const role = message.guild?.roles.cache.get(rolemap[xpForUser.level]);
		if (!role) return console.log('ROle not there');
		message.member?.roles.add(role);
	},
});
