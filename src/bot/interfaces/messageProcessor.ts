import { Message } from 'discord.js';

type ProcessFunction = (
	message: Message,
	cleanedContent: string,
	mentioned: boolean,
) => void | Promise<void>;

export interface MessageProcessorType {
	name: string;
	ignoreCommands: boolean;
	process: ProcessFunction;
}
