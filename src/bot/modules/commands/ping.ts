import { Command, RunOptions } from '../../interfaces/Command';
import { ApplicationCommandType } from 'discord.js';
export default class ping implements Command{
	name = 'ping';
	description = 'replies with pong';
	type = ApplicationCommandType.ChatInput;
	isSlash = true;
	guildOnly = true;
	async run(options: RunOptions){
		options.interaction?.followUp(`Ping: ${options.interaction?.client.ws.ping * 2}ms`);
	}
}
