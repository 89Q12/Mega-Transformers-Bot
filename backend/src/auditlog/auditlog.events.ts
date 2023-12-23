import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import {
  GuildMember,
  Guild,
  InvalidRequestWarningData,
  Invite,
  Message,
  MessageReaction,
  Role,
  GuildBasedChannel,
  DMChannel,
  Client,
} from 'discord.js';
import LogEntry from 'src/util/dto/log.entry.dto';
import { AuditLogService } from './auditlog.service';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserBanEvent,
  UserKickEvent,
  UserTimeOutEvent,
} from 'src/guild/moderation/events/user.events';
@Injectable()
export default class AuditEvents {
  constructor(
    @InjectDiscordClient() private readonly client: Client,
    @Inject(AuditLogService) private readonly auditLogService: AuditLogService,
  ) {}
  @On('error')
  error(error: Error) {
    const logEntry: LogEntry = {
      action: 'ERROR',
      guildId: '0',
      invokerId: this.client.user.id,
      targetId: '0',
      targetType: 'ERROR',
      extraInfo: JSON.stringify({ error: error }),
      reason: error.message,
      createdAt: new Date(),
    };
    Promise.resolve(this.auditLogService.create(logEntry));
  }

  @On('warn')
  warn(info: string) {
    const logEntry: LogEntry = {
      action: 'WARN',
      guildId: '0',
      invokerId: this.client.user.id,
      targetId: '0',
      targetType: 'WARN',
      extraInfo: JSON.stringify({ info: info }),
      reason: info,
      createdAt: new Date(),
    };
    Promise.resolve(this.auditLogService.create(logEntry));
  }

  @On('guildMemberAdd')
  async addMember(member: GuildMember) {
    const logEntry: LogEntry = {
      action: 'USER_JOINED',
      guildId: member.guild.id,
      invokerId: this.client.user.id,
      targetId: member.id,
      targetType: 'USER',
      extraInfo: JSON.stringify({ user: member.toJSON() }),
      reason: 'User joined',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }
  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    const logEntry: LogEntry = {
      action: 'USER_LEFT',
      guildId: member.guild.id,
      invokerId: this.client.user.id,
      targetId: member.id,
      targetType: 'USER',
      extraInfo: JSON.stringify({ user: member.toJSON() }),
      reason: 'User left',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('guildBanAdd')
  async banMember(guild: Guild, user: GuildMember) {
    const logEntry: LogEntry = {
      action: 'USER_BANNED',
      guildId: guild.id,
      invokerId: this.client.user.id,
      targetId: user.id,
      targetType: 'USER',
      extraInfo: JSON.stringify({ user: user.toJSON() }),
      reason: 'User banned',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('guildBanRemove')
  async unbanMember(guild: Guild, user: GuildMember) {
    const logEntry: LogEntry = {
      action: 'USER_UNBANNED',
      guildId: guild.id,
      invokerId: this.client.user.id,
      targetId: user.id,
      targetType: 'USER',
      extraInfo: JSON.stringify({ user: user.toJSON() }),
      reason: 'User unbanned',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('guildMemberUpdate')
  async updateMember(oldMember: GuildMember, newMember: GuildMember) {
    const logEntry: LogEntry = {
      action: 'USER_UPDATED',
      guildId: oldMember.guild.id,
      invokerId: this.client.user.id,
      targetId: oldMember.id,
      targetType: 'USER',
      extraInfo: JSON.stringify({
        old: oldMember.toJSON(),
        new: newMember.toJSON(),
      }),
      reason: 'User updated',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('guildUpdate')
  async updateGuild(oldGuild: Guild, newGuild: Guild) {
    const logEntry: LogEntry = {
      action: 'GUILD_UPDATED',
      guildId: oldGuild.id,
      invokerId: this.client.user.id,
      targetId: oldGuild.id,
      targetType: 'GUILD',
      extraInfo: JSON.stringify({
        old: oldGuild.toJSON(),
        new: newGuild.toJSON(),
      }),
      reason: 'Guild updated',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }
  @On('invalidRequestWarning')
  async invalidRequestWarning(data: InvalidRequestWarningData) {
    const logEntry: LogEntry = {
      action: 'INVALID_REQUEST',
      guildId: '0',
      invokerId: this.client.user.id,
      targetId: '0',
      targetType: 'INVALID_REQUEST',
      extraInfo: JSON.stringify({ data: data }),
      reason: `${data.count} invalid requests. Reaming time: ${data.remainingTime}`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('inviteCreate')
  async inviteCreate(invite: Invite) {
    const logEntry: LogEntry = {
      action: 'INVITE_CREATED',
      guildId: invite.guild.id,
      invokerId: invite.inviter.id,
      targetId: invite.code,
      targetType: 'INVITE',
      extraInfo: JSON.stringify({ invite: invite.toJSON() }),
      reason: `Invite created with code ${invite.code}`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('inviteDelete')
  async inviteDelete(invite: Invite) {
    const logEntry: LogEntry = {
      action: 'INVITE_DELETED',
      guildId: invite.guild.id,
      invokerId: invite.inviter.id,
      targetId: invite.code,
      targetType: 'INVITE',
      extraInfo: JSON.stringify({ invite: invite.toJSON() }),
      reason: `Invite deleted with code ${invite.code}`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('messageDelete')
  async messageDelete(message: Message) {
    const logEntry: LogEntry = {
      action: 'MESSAGE_DELETED',
      guildId: message.guild.id,
      invokerId: message.author.id || '0',
      targetId: message.id || '0',
      targetType: 'MESSAGE',
      extraInfo: JSON.stringify({ message: message.toJSON() }),
      reason: `Message deleted`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('messageReactionAdd')
  async reactionAdd(message: MessageReaction, user: GuildMember) {
    const logEntry: LogEntry = {
      action: 'REACTION_ADDED',
      guildId: message.message.guild.id,
      invokerId: user.id,
      targetId: message.message.id,
      targetType: 'MESSAGE',
      extraInfo: JSON.stringify({ reaction: message.toJSON() }),
      reason: `Reaction added`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('messageReactionRemove')
  async reactionRemove(message: MessageReaction, user: GuildMember) {
    const logEntry: LogEntry = {
      action: 'REACTION_REMOVED',
      guildId: message.message.guild.id,
      invokerId: user.id,
      targetId: message.message.id,
      targetType: 'MESSAGE',
      extraInfo: JSON.stringify({ reaction: message.toJSON() }),
      reason: `Reaction removed`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('roleCreate')
  async roleCreate(role: Role) {
    const logEntry: LogEntry = {
      action: 'ROLE_CREATED',
      guildId: role.guild.id,
      invokerId: this.client.user.id,
      targetId: role.id,
      targetType: 'ROLE',
      extraInfo: JSON.stringify({ role: role.toJSON() }),
      reason: `Role created`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('roleDelete')
  async roleDelete(role: Role) {
    const logEntry: LogEntry = {
      action: 'ROLE_DELETED',
      guildId: role.guild.id,
      invokerId: this.client.user.id,
      targetId: role.id,
      targetType: 'ROLE',
      extraInfo: JSON.stringify({ role: role.toJSON() }),
      reason: `Role deleted`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('roleUpdate')
  async roleUpdate(oldRole: Role, newRole: Role) {
    const logEntry: LogEntry = {
      action: 'ROLE_UPDATED',
      guildId: oldRole.guild.id,
      invokerId: this.client.user.id,
      targetId: oldRole.id,
      targetType: 'ROLE',
      extraInfo: JSON.stringify({
        old: oldRole.toJSON(),
        new: newRole.toJSON(),
      }),
      reason: 'Role updated',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('channelCreate')
  async channelCreate(channel: GuildBasedChannel) {
    const logEntry: LogEntry = {
      action: 'CHANNEL_CREATED',
      guildId: channel.guild.id,
      invokerId: this.client.user.id,
      targetId: channel.id,
      targetType: 'CHANNEL',
      extraInfo: JSON.stringify({ channel: channel.toJSON() }),
      reason: `Channel created`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('channelDelete')
  async channelDelete(channel: GuildBasedChannel | DMChannel) {
    const logEntry: LogEntry = {
      action: 'CHANNEL_DELETED',
      guildId: channel.isDMBased() ? '0' : channel.guild.id,
      invokerId: this.client.user.id,
      targetId: channel.id,
      targetType: 'CHANNEL',
      extraInfo: JSON.stringify({ channel: channel.toJSON() }),
      reason: `Channel deleted`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @On('channelUpdate')
  async channelUpdate(
    oldChannel: GuildBasedChannel | DMChannel,
    newChannel: GuildBasedChannel | DMChannel,
  ) {
    const logEntry: LogEntry = {
      action: 'CHANNEL_UPDATED',
      guildId: oldChannel.isDMBased() ? '0' : oldChannel.guild.id,
      invokerId: this.client.user.id,
      targetId: oldChannel.id,
      targetType: 'CHANNEL',
      extraInfo: JSON.stringify({
        old: oldChannel.toJSON(),
        new: newChannel.toJSON(),
      }),
      reason: 'Channel updated',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }
  @On('webhooksUpdate')
  async webhooksUpdate(channel: GuildBasedChannel) {
    console.log(channel);
    const logEntry: LogEntry = {
      action: 'WEBHOOKS_UPDATED',
      guildId: channel.guild.id,
      invokerId: this.client.user.id,
      targetId: channel.id,
      targetType: 'CHANNEL',
      extraInfo: JSON.stringify({ channel: channel.toJSON() }),
      reason: `Webhooks updated`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }
  @OnEvent('user.timeout.created')
  async onUserTimeoutCreated(payload: UserTimeOutEvent) {
    const logEntry: LogEntry = {
      action: 'TIMEOUT',
      guildId: payload.guildId,
      invokerId: this.client.user.id,
      targetId: payload.userId,
      targetType: 'USER',
      extraInfo: JSON.stringify({ timeout: payload }),
      reason: `User timeout created`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }
  @OnEvent('user.timeout.expired')
  async onUserTimeoutExpired(payload: UserTimeOutEvent) {
    const logEntry: LogEntry = {
      action: 'TIMEOUT_EXPIRED',
      guildId: payload.guildId,
      invokerId: this.client.user.id,
      targetId: payload.userId,
      targetType: 'USER',
      reason: `User timeout expired`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @OnEvent('user.kick')
  async onUserKick(payload: UserKickEvent) {
    const logEntry: LogEntry = {
      action: 'KICK',
      guildId: payload.guildId,
      invokerId: this.client.user.id,
      targetId: payload.userId,
      targetType: 'USER',
      reason: `User kicked`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @OnEvent('user.ban')
  async onUserBan(payload: UserBanEvent) {
    const logEntry: LogEntry = {
      action: 'BAN',
      guildId: payload.guildId,
      invokerId: this.client.user.id,
      targetId: payload.userId,
      targetType: 'USER',
      reason: `User banned`,
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }
}
