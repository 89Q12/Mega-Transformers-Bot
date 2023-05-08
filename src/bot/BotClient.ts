import {
	ApplicationCommandDataResolvable,
	ApplicationCommandPermissionType,
	EmbedBuilder,
	Client,
	ClientEvents,
	Collection,
	TextChannel,
} from 'discord.js';
import {glob} from 'glob';
import { promisify } from 'util';
import { BotConfig, ExtendedClient, Settings } from './interfaces/Client';
import { Event } from './lib/Event';
import { CommandType } from './interfaces/Command';
import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import dbConfig from './config/mikro-orm.config';
import { Guilds } from './entities';
import { Job } from 'node-schedule';
import { Channelcleans } from './entities/Channelcleans';
import util from './Util';
import { MessageProcessorType } from './interfaces/messageProcessor';
// Used for importing commands and events asyncly

export class BOT extends Client implements ExtendedClient {
	// properties
	public commands: Collection<string, CommandType>;
	public slashCommands: Array<ApplicationCommandDataResolvable>;
	public channelsToClean: Collection<string, Job>;
	public cooldowns: Collection<string, Collection<string, number>>;
	public messageProcessors: Collection<string, MessageProcessorType>;
	public guildID!: string;
	// Settings from the database
	public settings!: Settings;
	public orm!: MikroORM<IDatabaseDriver<Connection>>;
	// Settings from the config file needs to be reworked
	public config!: BotConfig;
	public booted: boolean; // prevents the bot from taking in commands before everything has been initialized
	constructor() {
		// All intents 32767
		super({ intents: 32767 });
		this.commands = new Collection<string, CommandType>();
		this.slashCommands = new Array<ApplicationCommandDataResolvable>();
		this.cooldowns = new Collection<string, Collection<string, number>>();
		this.messageProcessors = new Collection<string, MessageProcessorType>();
		this.channelsToClean = new Collection<string, Job>();
		this.booted = false;
		// setup listeners
		this.on('error', this.onError);
	}

	async start(BOT_CONFIG: BotConfig) {
		this.guildID = BOT_CONFIG.guildID;
		this.config = BOT_CONFIG;
		// Register modules, login afterwards and register the on
		await this.registerModules();
		//register all commands once the bot is ready
		this.on('ready', async () => {
			await this.registerCommands().then(() => this.setPermissions());
			await this.guilds
				.fetch(this.guildID)
				.then(() => this.registerCleaningJobs());
			this.booted = true;
			console.log('Booted');
		});
		// logs the bot in
		await this.login(BOT_CONFIG.botToken);
		// inits the orm db object
		// REWORK CONFIG
		dbConfig.dbName = BOT_CONFIG.database;
		this.orm = await MikroORM.init(dbConfig);
		// parses the settings data from the db into settings property
		await this._parseSettings();
	}

	async importFile(filePath: string) {
		return (await import(filePath))?.default;
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
	async registerCleaningJobs() {
		this.channelsToClean = new Collection();
		(await this.orm.em.getRepository(Channelcleans).findAll()).forEach(
			(ChannelToClean: Channelcleans) => {
				console.log(ChannelToClean.cname);
				const cleanTime = parseInt(ChannelToClean.cleantime);
				const warnTime = parseInt(ChannelToClean.warningtime);
				this.channelsToClean.set(
					ChannelToClean.cname + '_warn',
					util.produceWarnJob(
						cleanTime,
						warnTime,
						ChannelToClean.cname,
						async (_firedate: Date) => {
							const chan: TextChannel | undefined = await util.getChannelByName(
								this,
								ChannelToClean.cname,
							);
							if (typeof chan === 'undefined') return;
							util.warnChannel(
								chan as TextChannel,
								this,
								parseInt(ChannelToClean.warningtime),
							);
						},
					),
				);
				this.channelsToClean.set(
					ChannelToClean.cname + '_clean',
					util.produceCleanJob(
						cleanTime,
						ChannelToClean.cname,
						async (_firedate: Date) => {
							const chan: TextChannel | undefined = await util.getChannelByName(
								this,
								ChannelToClean.cname,
							);
							if (typeof chan === 'undefined') return;
							util.clean(chan as TextChannel);
						},
					),
				);
			},
		);
	}
	async registerModules() {
		// Commands
		const commandFiles = await glob(`${__dirname}/commands/*.js`);
		commandFiles.forEach(async (filePath: string) => {
			const command: CommandType = await this.importFile(filePath);
			if (!command.name) return;
			command.isSlash
				? this.slashCommands.push(command)
				: this.commands.set(command.name, command);
		});
		// Events
		const eventFiles = await glob(`${__dirname}/events/*.js`);
		eventFiles.forEach(async (filePath: string) => {
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
		//message processors
		const messageProcessorFiles = await glob(
			`${__dirname}/messageprocessors/*.js`,
		);

		messageProcessorFiles.forEach(async (filepath: string) => {
			const messageProcessor: MessageProcessorType = await this.importFile(
				filepath,
			);
			if (!messageProcessor.name) return;
			this.messageProcessors.set(messageProcessor.name, messageProcessor);
		});
	}
	async _parseSettings() {
		// Parses the data from the db into the settings type object,
		// if a value isn't set a default value the for given type is set, e.g false for boolean.
		// Needs to be called after connecting to the database, get all guilds but we only one so using index 0 is safe
		const rawSetting = await this.orm.em.getRepository(Guilds).findAll();
		// Due to the database being setup in a weird way we need to do some cast magic
		// As the types are TEXT in the database casting like this is safe
		this.settings = {
			levelRoleMap: JSON.parse(rawSetting[0].levelRoleMap),
			measureXP: (rawSetting[0].measureXP as unknown as boolean) ?? false,
			spamFilter: (rawSetting[0].spamFilter as unknown as boolean) ?? false,
			// These followering properties are just string so no casting needed
			onJoinDMMsg: rawSetting[0].onJoinDMMsg ?? '',
			onJoinDMMsgTitle: rawSetting[0].onJoinDMMsgTitle ?? '',
			prefix: rawSetting[0].prefix ?? this.config.commands.prefix,
		};
	}
	async onError(error: Error) {
		if (!this.config.errors.channel.length) return;
		const channel = await this.guilds.cache
			.get(this.guildID)
			?.channels.fetch(this.config.errors.channel);
		if (typeof channel === 'undefined' || null) {
			this.guilds.cache.get(this.guildID)?.systemChannel?.send({
				embeds: [
					new EmbedBuilder().setTitle(error.name).setDescription(error.message),
				],
			});
			return;
		}
		(channel as TextChannel).send({
			embeds: [
				new EmbedBuilder().setTitle(error.name).setDescription(error.message),
			],
		});
	}
}
