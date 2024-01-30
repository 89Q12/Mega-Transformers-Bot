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
      guildId: this.client.guilds.cache.first().id,
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
      guildId: this.client.guilds.cache.first().id,
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
    try {
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
    } catch (error) {
      this.error(error);
    }
  }
  @On('guildMemberRemove')
  async removeMember(member: GuildMember) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('guildBanAdd')
  async banMember(guild: Guild, user: GuildMember) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('guildBanRemove')
  async unbanMember(guild: Guild, user: GuildMember) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('guildMemberUpdate')
  async updateMember(oldMember: GuildMember, newMember: GuildMember) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('guildUpdate')
  async updateGuild(oldGuild: Guild, newGuild: Guild) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }
  @On('invalidRequestWarning')
  async invalidRequestWarning(data: InvalidRequestWarningData) {
    try {
      const logEntry: LogEntry = {
        action: 'INVALID_REQUEST',
        guildId: this.client.guilds.cache.first().id,
        invokerId: this.client.user.id,
        targetId: '0',
        targetType: 'INVALID_REQUEST',
        extraInfo: JSON.stringify({ data: data }),
        reason: `${data.count} invalid requests. Reaming time: ${data.remainingTime}`,
        createdAt: new Date(),
      };
      await this.auditLogService.create(logEntry);
    } catch (error) {
      this.error(error);
    }
  }

  @On('inviteCreate')
  async inviteCreate(invite: Invite) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('inviteDelete')
  async inviteDelete(invite: Invite) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('messageDelete')
  async messageDelete(message: Message) {
    try {
      const logEntry: LogEntry = {
        action: 'MESSAGE_DELETED',
        guildId: message.guild.id || '0',
        invokerId: message.author.id || '0',
        targetId: message.id || '0',
        targetType: 'MESSAGE',
        extraInfo: JSON.stringify({ message: message.toJSON() }),
        reason: `Message deleted`,
        createdAt: new Date(),
      };
      await this.auditLogService.create(logEntry);
    } catch (error) {
      this.error(error);
    }
  }

  @On('messageReactionAdd')
  async reactionAdd(message: MessageReaction, user: GuildMember) {
    try {
      const logEntry: LogEntry = {
        action: 'REACTION_ADDED',
        guildId: message.message.guild.id || '0',
        invokerId: user.id,
        targetId: message.message.id,
        targetType: 'MESSAGE',
        extraInfo: JSON.stringify({ reaction: message.toJSON() }),
        reason: `Reaction added`,
        createdAt: new Date(),
      };
      await this.auditLogService.create(logEntry);
    } catch (error) {
      this.error(error);
    }
  }

  @On('messageReactionRemove')
  async reactionRemove(message: MessageReaction, user: GuildMember) {
    try {
      const logEntry: LogEntry = {
        action: 'REACTION_REMOVED',
        guildId: message.message.guild.id || '0',
        invokerId: user.id,
        targetId: message.message.id,
        targetType: 'MESSAGE',
        extraInfo: JSON.stringify({ reaction: message.toJSON() }),
        reason: `Reaction removed`,
        createdAt: new Date(),
      };
      await this.auditLogService.create(logEntry);
    } catch (error) {
      this.error(error);
    }
  }

  @On('roleCreate')
  async roleCreate(role: Role) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('roleDelete')
  async roleDelete(role: Role) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('roleUpdate')
  async roleUpdate(oldRole: Role, newRole: Role) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('channelCreate')
  async channelCreate(channel: GuildBasedChannel) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('channelDelete')
  async channelDelete(channel: GuildBasedChannel | DMChannel) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @On('channelUpdate')
  async channelUpdate(
    oldChannel: GuildBasedChannel | DMChannel,
    newChannel: GuildBasedChannel | DMChannel,
  ) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }
  @On('webhooksUpdate')
  async webhooksUpdate(channel: GuildBasedChannel) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }
  @OnEvent('user.timeout.created')
  async onUserTimeoutCreated(payload: UserTimeOutEvent) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }
  @OnEvent('user.timeout.expired')
  async onUserTimeoutExpired(payload: UserTimeOutEvent) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @OnEvent('user.kick')
  async onUserKick(payload: UserKickEvent) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }

  @OnEvent('user.ban')
  async onUserBan(payload: UserBanEvent) {
    try {
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
    } catch (error) {
      this.error(error);
    }
  }
}
