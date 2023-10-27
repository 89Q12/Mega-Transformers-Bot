import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import {
  Client,
  DMChannel,
  Guild,
  GuildBasedChannel,
  GuildMember,
  InvalidRequestWarningData,
  Invite,
  Message,
  MessageReaction,
  Role,
} from 'discord.js';
import LogEntry from 'src/entities/logEntry';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async create(entry: LogEntry) {
    console.log(entry);
    return await this.prismaService.auditLog.create({
      data: {
        action: entry.action,
        guildId: entry.guildId,
        invokerId: entry.invokerId,
        reason: entry.reason,
        targetId: entry.targetId,
        targetType: entry.targetType,
        extraInfo: entry.extraInfo,
        createdAt: entry.createdAt,
      },
    });
  }
}
