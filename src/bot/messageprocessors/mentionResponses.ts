import { EmbedBuilder } from 'discord.js';
import { MessageProcessor } from '../lib/MessageProcessor';
import { MentionResponses } from '../entities/MentionResponses';
import { ExtendedClient } from '../interfaces/Client';
export default new MessageProcessor({
	name: 'mentionResponse',
	ignoreCommands: true,
	process: async (message, cleanContent, mentioned) => {
		if (!mentioned) return;
		const client: ExtendedClient = message.client as ExtendedClient;
		for (const mentionResponse of await client.orm.em
			.getRepository(MentionResponses)
			.findAll()) {
			if (cleanContent == mentionResponse.trigger) {
				const embed = new EmbedBuilder()
					.setDescription(
						mentionResponse.response.replace(
							new RegExp('[$]{author}', 'gi'),
							message.author.username,
						),
					)
					.setColor('#ff51ff');

				if (mentionResponse.image !== 'null')
					embed.setImage(mentionResponse.image);

				message.channel.send({ embeds: [embed] });
				break;
			}
		}
	},
});
