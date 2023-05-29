import {
	ApplicationCommandDataResolvable,
	Client,
	ClientPresence,
	Collection,
} from 'discord.js';
import { Command } from './Command';
import { MessageProcessorType } from './messageProcessor';
import { Cron } from 'croner';

export interface RegisterCommandsOptions {
	guildId?: string;
	commands: ApplicationCommandDataResolvable[];
}
export interface Settings {
	prefix: string;
	spamFilter: boolean;
}
export interface BotConfig {
	chat: {
		xpPerMsg: number;
		dmResponse: string;
		missingPermissions: string;
	};
	botToken: string;
	commands: {
		admins: Array<string>;
		prefix: string;
		permissions: Array<{
			name: string;
			id: string;
			type: string;
			permission: boolean;
		}>;
	};
	ban: {
		defaultImage: string;
	};
	errors: {
		mentionwhencrash: Array<string>;
		channel: string;
	};
	database: string;
	guildID: string;
	spam: {
		maxWarnings: number;
	};
	discordPresence: ClientPresence | null;
}
export interface ExtendedClient extends Client {
	commands: Collection<string, Command>;
	slashCommands: Array<ApplicationCommandDataResolvable>;
	cooldowns: Collection<string, Collection<string, number>>;
	messageProcessors: Collection<string, MessageProcessorType>;
	backgroundJobs: Collection<string, Cron>;
	guildID: string;
	settings: Settings;
	config: BotConfig;
	booted: boolean;
	start(BOT_CONFIG: BotConfig): void;
	importFile(filePath: string): Promise<unknown>;
	registerCommands(): Promise<void>;
}
