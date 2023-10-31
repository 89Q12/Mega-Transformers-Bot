import { Inject, Injectable } from '@nestjs/common';
import LogEntry from 'src/util/dto/log.entry.dto';
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
        extraInfo: entry.extraInfo || null,
        createdAt: entry.createdAt,
      },
    });
  }
}
