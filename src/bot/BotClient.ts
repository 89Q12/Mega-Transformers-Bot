import {
	ApplicationCommandDataResolvable,
	ApplicationCommandPermissionType,
	Client,
	ClientEvents,
	Collection,
} from 'discord.js';
import { glob } from 'glob';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { BotConfig, ExtendedClient, Settings } from './interfaces/Client';
import { Event } from './lib/Event';
import { Command } from './interfaces/Command';
import { MessageProcessorType } from './interfaces/messageProcessor';
import { Cron } from 'croner';
import { BackgroundJob } from './interfaces/backgroundJob';
import { Dependency } from './interfaces/dependency';
import { typeInfo } from 'tsyringe/dist/typings/dependency-container';

export class BOT extends Client implements ExtendedClient {
	// properties
	public commands: Collection<string, Command>;
	public slashCommands: Array<ApplicationCommandDataResolvable>;
	public cooldowns: Collection<string, Collection<string, number>>;
	public messageProcessors: Collection<string, MessageProcessorType>;
	public guildID!: string;
	// Settings from the database
	public settings!: Settings;
	// Settings from the config file needs to be reworked
	public config!: BotConfig;
	public booted: boolean; // prevents the bot from taking in commands before everything has been initialized
	backgroundJobs: Collection<string, Cron>;
	constructor() {
		// All intents 32767
		super({ intents: 32767  });
		this.commands = new Collection<string, Command>();
		this.slashCommands = new Array<ApplicationCommandDataResolvable>();
		this.cooldowns = new Collection<string, Collection<string, number>>();
		this.messageProcessors = new Collection<string, MessageProcessorType>();
		this.backgroundJobs = new Collection<string, Cron>();
		this.booted = false;
		// setup listeners
	}

	async start(BOT_CONFIG: BotConfig) {
		this.guildID = BOT_CONFIG.guildID;
		this.config = BOT_CONFIG;
		// Register modules, login afterwards and register the on
		await this.registerModules();
		//register all commands once the bot is ready
		this.on('ready', async () => {
			await this.registerCommands().then(() => this.setPermissions());
			this.booted = true;
			console.log('Booted');
		});
		// logs the bot in
		await this.login(BOT_CONFIG.botToken);
		// parses the settings data from the db into settings property
		await this._parseSettings();
	}

	async importFile(filePath: string, moduleName = 'default') {
		return (await import(filePath))?.[moduleName];
	}

	async registerCommands() {
		if (this.guildID) {
			this.guilds.cache.get(this.guildID)?.commands.set(this.slashCommands);
			console.log(`Registering commands to ${this.guildID}`);
		} else {
			console.log('Registering global commands');
			process.emitWarning('No guildID', {
				code: 'GLOBAL_NOTALLOWED',
				detail: 'Global commands are not supported',
			});
		}
	}
	async setPermissions() {
		const commands = await this.guilds.cache
			.get(this.guildID)
			?.commands.fetch();
		this.config.commands.permissions.forEach((permission) => {
			commands?.map((command) => {
				if (command.name == permission.name) {
					command.permissions.add({
						permissions: [
							{
								id: permission.id,
								type: permission.type as unknown as ApplicationCommandPermissionType,
								permission: permission.permission,
							},
						],
						token: this.config.botToken
					});
				}
			});
		});
	}
	async registerModules() {
		const deps = await glob(
			`${__dirname}/modules/dependencies/*.ts`,
		);
		deps.forEach(async (filePath: string) => {
			const dep: Dependency = (await this.importFile(filePath));
			container.register(dep.class,{useClass: dep.class});
		});
		// Commands
		const commandFiles = await glob(`${__dirname}/modules/commands/*.ts`);
		commandFiles.forEach(async (filePath: string) => {
			const command: Command = container.resolve(await this.importFile(filePath));
			command.isSlash
				? this.slashCommands.push(command)
				: this.commands.set(command.name, command);
		});
		// Events
		const eventFiles = await glob(`${__dirname}/modules/events/*.ts`);
		eventFiles.forEach(async (filePath: string) => {
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
		//message processors
		const messageProcessorFiles = await glob(
			`${__dirname}/modules/messageprocessors/*.ts`,
		);

		messageProcessorFiles.forEach(async (filepath: string) => {
			const messageProcessor: MessageProcessorType = await this.importFile(
				filepath,
			);
			if (!messageProcessor.name) return;
			this.messageProcessors.set(messageProcessor.name, messageProcessor);
		});
		const backgroundJobs = await glob(
			`${__dirname}/modules/backgroundJobs/*.ts`,
		);
		backgroundJobs.forEach(async (filePath: string) => {
			const job: BackgroundJob = new (await this.importFile(filePath));
			this.backgroundJobs.set(job.name, new Cron(job.pattern,job.options,job.run));
		});

	}
	async _parseSettings() {
		this.settings = {
			prefix: '.',
			spamFilter: false,

		};
	}
}
