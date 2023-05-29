import {
	ApplicationCommandDataResolvable,
	ApplicationCommandPermissionType,
	Client,
	ClientEvents,
	Collection,
	GatewayIntentBits,
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
		// All intents
		super({ intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],  });
		this.commands = new Collection<string, Command>();
		this.slashCommands = new Array<ApplicationCommandDataResolvable>();
		this.cooldowns = new Collection<string, Collection<string, number>>();
		this.messageProcessors = new Collection<string, MessageProcessorType>();
		this.backgroundJobs = new Collection<string, Cron>();
		this.booted = false;
	}

	async start(BOT_CONFIG: BotConfig) {
		this.guildID = BOT_CONFIG.guildID;
		this.config = BOT_CONFIG;
		// Register modules, login afterwards and register the on
		await this.loadModules();
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
	async loadModules(){
		this.registerModules(`${__dirname}/modules/dependencies/*.ts`,(module: Dependency) => container.register(module.class,{useClass: module.class}));
		this.registerModules(`${__dirname}/modules/commands/*.ts`,(module: any) => {
			const command: Command = container.resolve(module);
			command.isSlash
				? this.slashCommands.push(command)
				: this.commands.set(command.name, command);
		});
		this.registerModules(`${__dirname}/modules/messageprocessors/*.ts`,(messageProcessor: MessageProcessorType) => {
			if (!messageProcessor.name) return;
			this.messageProcessors.set(messageProcessor.name, messageProcessor);
		});
		this.registerModules(`${__dirname}/modules/backgroundJobs/*.ts`,(module: any) => {
			const job: BackgroundJob = container.resolve(module);
			this.backgroundJobs.set(job.name, new Cron(job.pattern,job.options,job.run));
		});
		this.registerModules(`${__dirname}/modules/events/*.ts`,(event: Event<keyof ClientEvents>) =>this.on(event.event, event.run));
	}
	async registerModules(path: string, callback: (this: ExtendedClient, module: any) => void) {
		const modules =  await glob(
			path,
		);

		modules.forEach(async (filePath: string) => {
			const module = (await this.importFile(filePath));
			callback.call(this, module);
		});
	}
	async _parseSettings() {
		this.settings = {
			prefix: '.',
			spamFilter: false,

		};
	}
}
