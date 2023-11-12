import { Inject, Injectable } from '@nestjs/common';
import LogEntry from 'src/util/dto/log.entry.dto';
import { PrismaService } from 'src/prisma.service';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';

@Injectable()
export class AuditLogService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async create(entry: LogEntry) {
    return await this.prismaService.auditLog.create({
      data: {
        action: entry.action,
        guildId: entry.guildId,
        invokerId: entry.invokerId,
        reason: entry.reason,
        targetId: entry.targetId,
        targetType: entry.targetType,
        extraInfo: entry.extraInfo || null,
        createdAt: entry.createdAt,
      },
    });
  }

  async find(guildId: string, filter: AuditLogFilterDto) {
    return this.prismaService.auditLog.findMany({
      select: {
        action: true,
        invokerId: true,
        reason: true,
        targetId: true,
        targetType: true,
        extraInfo: true,
        createdAt: true,
      },
      where: {
        guildId,
        createdAt:
          filter.createdFrom || filter.createdTill
            ? {
                gte: filter.createdFrom,
                lte: filter.createdTill,
              }
            : undefined,
        action: filter.actions ? { in: filter.actions } : undefined,
        targetType: filter.targetTypes ? { in: filter.targetTypes } : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
