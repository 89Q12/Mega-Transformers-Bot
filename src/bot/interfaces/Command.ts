import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	GuildMember,
	Message,
	PermissionResolvable,
} from 'discord.js';
import { ApplicationCommandType } from 'discord.js';
import { ExtendedClient } from './Client';

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * ...
 * run: async({ interaction }) => {
 *
 * }
 * }
 */

type DiscordPermissionString =
	| 'CREATE_INSTANT_INVITE'
	| 'KICK_MEMBERS'
	| 'BAN_MEMBERS'
	| 'ADMINISTRATOR'
	| 'MANAGE_CHANNELS'
	| 'MANAGE_GUILD'
	| 'ADD_REACTIONS'
	| 'VIEW_AUDIT_LOG'
	| 'PRIORITY_SPEAKER'
	| 'STREAM'
	| 'VIEW_CHANNEL'
	| 'SEND_MESSAGES'
	| 'SEND_TTS_MESSAGES'
	| 'MANAGE_MESSAGES'
	| 'EMBED_LINKS'
	| 'ATTACH_FILES'
	| 'READ_MESSAGE_HISTORY'
	| 'MENTION_EVERYONE'
	| 'USE_EXTERNAL_EMOJIS'
	| 'VIEW_GUILD_INSIGHTS'
	| 'CONNECT'
	| 'SPEAK'
	| 'MUTE_MEMBERS'
	| 'DEAFEN_MEMBERS'
	| 'MOVE_MEMBERS'
	| 'USE_VAD'
	| 'CHANGE_NICKNAME'
	| 'MANAGE_NICKNAMES'
	| 'MANAGE_ROLES'
	| 'MANAGE_WEBHOOKS'
	| 'MANAGE_EMOJIS';
export interface ExtendedInteraction extends CommandInteraction {
	member: GuildMember;
}

export interface RunOptions {
	client: ExtendedClient;
	interaction?: ExtendedInteraction;
	interactionOptions?: CommandInteractionOptionResolver;
	message?: Message;
	params?: Array<string>;
}
export type RunFunction = (options: RunOptions) => unknown | Promise<unknown>;

export type CommandType = {
	name: string;
	aliases?: Array<string>;
	description: string;
	usage?: string;
	missingArgumentsResponse?: string;
	type: ApplicationCommandType;
	isSlash: boolean;
	isClass: boolean;
	subCmdsName?: Array<string>;
	isArgumentsRequired?: boolean;
	guildOnly: boolean;
	cooldown?: number;
	userPermissions?: Array<PermissionResolvable>;
	isAdminOnly?: boolean;
	requiredPermissions?: Array<DiscordPermissionString>;
	requiredRoles?: Array<string>;
	run: RunFunction;
} & Record<string, unknown>;
