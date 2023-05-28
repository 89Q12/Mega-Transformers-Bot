import {
	ChannelType,
	Collection,
	Message,
	PermissionResolvable,
	TextChannel,
	userMention
} from 'discord.js';
import { ExtendedClient } from '../interfaces/Client';
import { Command, RunFunction, RunOptions } from '../interfaces/Command';

export async function processCommands(
	message: Message,
	command: Command,
	args: Array<string>,
	client: ExtendedClient,
): Promise<unknown | undefined> {
	if (
		command.isAdminOnly &&
		!client.config.commands.admins.includes(message.author.id) // we pretend the command doesn't exist, this reduces the attack surface
	) {
		message.reply(
			`There is no such command: ${client.settings.prefix}${command.name}`,
		);
		return;
	}
	// Checks if the command is guild only and that it is a text channel
	if (!(command.guildOnly && message.channel.type == ChannelType.GuildText)) {
		message.reply('Guild only');
		return;
	}
	// check for args requirements and gives usage if usage is specified
	if (command.isArgumentsRequired && !args.length) {
		let reply: string = userMention(message.author.id) + ' ';
		if (command.missingArgumentsResponse) {
			reply += command.missingArgumentsResponse;
		} else {
			reply += ' You have to give me something to work with!';
		}

		if (command.usage) {
			reply += `\nUsage: \`${client.settings.prefix}${command.name} ${command.usage}\``;
		}

		message.reply(reply);
		return;
	}
	// checks if the command is a class command and checks if the class has a function that maps to the first arg given
	let runMethode: RunFunction = command.run;
	if (command.isClass) {
		if (command.subCmdsName?.includes(args[0])) {
			runMethode = (command as unknown as Record<string, () => void>)[args[0].replace('-', '')] as RunFunction;
			args.shift();
		} else {
			message.reply(`Unknown subcommand ${args[0]} of command ${command.name}`);
			return;
		}
	}
	// commands that require certain discord permissions
	if (command.requiredPermissions) {
		const authorPermissions = (message.channel as TextChannel).permissionsFor(
			message.author,
		);

		if (
			!authorPermissions ||
			!authorPermissions.has(
				command.requiredPermissions as unknown as PermissionResolvable[],
			)
		) {
			message.reply('');
			return;
		}
	}
	// commands that require certain roles
	if (command.requiredRoles) {
		const { requiredRoles: commandUserRoles } = command;
		const hasRole = message.member?.roles.cache.some((role) =>
			commandUserRoles.includes(role.name),
		);
		if (!hasRole) {
			message.reply(`${commandUserRoles.join(', ')}`);
			return;
		}
	}

	// command delay to avoid spamming YAAAS thats right cooldowns are a thing now
	if (!client.cooldowns?.has(command.name)) {
		client.cooldowns?.set(command.name, new Collection());
	}
	const now = Date.now();
	// get cooldown(s) for current command can be null
	const timestamps = client.cooldowns?.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps?.has(message.author.id)) {
		const expirationTime =
			(timestamps.get(message.author.id) ?? 0) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			message.reply(` ${timeLeft.toFixed(1)}\`${command.name}\``);
			return;
		}
	}
	timestamps?.set(message.author.id, now);
	setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);

	// After that we can safely try to execute the command
	try {
		runMethode.call(command, {
			client: client as ExtendedClient,
			message: message,
			params: args,
		} as RunOptions);
	} catch (error) {
		client.emit('error', error as Error);
	}
}
