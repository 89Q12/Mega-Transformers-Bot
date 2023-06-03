import { Command } from '../../interfaces/Command';
import BotEvent from '../../interfaces/Event';
import { ExtendedClient } from '../../interfaces/Client';
import { processCommands } from '../../lib/commandsManager';
import { Message } from 'discord.js';
// Non slash commands
export default class OnMessage implements BotEvent<'messageCreate'> {

	async run(message: Message<boolean>) {
		// checks if the bot has booted(initialized)
		if (!(message.client as ExtendedClient).booted) return;
		// We don't need to waste execution time if its an interaction
		if (message.interaction || message.author.bot) return;
		const client: ExtendedClient = message.client as ExtendedClient; // shorthand for message.client
		// Command checking
		const mentionString = client.user?.username;
		const cleanContent = message.cleanContent;
		// We need to do some regex magic because sometimes for what ever reason there can be an unknown character in the mention string WTF DISCORD(JS)
		const splitContent = cleanContent
			.trim()
			.replace(/[^a-zA-Z ]/g, '')
			.split(/ +/);
		let isCommand = false;
		// Was the bot mentioned
		const mentioned: boolean =
			splitContent.at(0) == mentionString || splitContent.at(-1) == mentionString;
		const cleanedContent = cleanContent
			.split(/ +/)
			.filter((e: string) => e.replace(/[^a-zA-Z ]/g, '') !== mentionString)
			.join(' ');
		if (
			splitContent.at(0) == mentionString ||
			message.content.startsWith(client.settings.prefix, 0)
		) {
			const args =
				splitContent.at(0) == mentionString
					? cleanedContent.split(/ +/)
					: cleanContent.slice(client.settings.prefix.length).trim().split(/ +/);
			// Command args, command name and Command itself
			const commandName = args.shift()?.toLowerCase() || '';
			const command: Command | undefined =
				client.commands.get(commandName) ??
				client.commands.find((command) =>
					command.aliases?.includes(commandName) ? true : false,
				);
			if (!command) {
				await message.reply(
					`There is no such command: ${client.settings.prefix}${commandName}`,
				);
				isCommand = true;
			} else {
				isCommand = true;
				const error: unknown | undefined = await processCommands(
					message,
					command as Command,
					args,
					client,
				);
				if (error) client.emit('error', error as Error);
			}
		}
		// Execute every messageProcessor that ignores commands
		client.messageProcessors.forEach((messageProcessor) => {
			try {
				if (isCommand) {
					if (!messageProcessor.ignoreCommands)
						messageProcessor.process(message, cleanedContent, mentioned);
				} else if (!isCommand && messageProcessor.ignoreCommands) {
					messageProcessor.process(message, cleanedContent, mentioned);
				}
			} catch (error) {
				client.emit('error', error as Error);
			}
		});
	}
}
