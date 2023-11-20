import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';
import { AuditLogService } from './auditlog.service';
import { LogEntryDto } from './dto/log-entry.dto';
import { plainToInstance } from '../util/functions/plain-to-instance';
import { Action, TargetType } from '../util/dto/log.entry.dto';

@Controller('auditlog')
export class AuditLogController {
  constructor(
    @Inject(AuditLogService) private readonly auditLogService: AuditLogService,
  ) {}

  @Get(':guildId')
  async getAuditLog(
    @Param('guildId') guildId: string,
    @Query(ValidationPipe) filter: AuditLogFilterDto,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<{ total: number; data: LogEntryDto[] }> {
    return this.auditLogService
      .find(guildId, filter, { offset, limit })
      .then((result) => ({
        total: result.total,
        data: result.data.map((it) =>
          plainToInstance(LogEntryDto, {
            action: it.action as Action,
            createdAt: it.createdAt,
            invokerId: it.invokerId,
            reason: it.reason,
            targetId: it.targetId,
            targetType: it.targetType as TargetType,
          }),
        ),
      }));
  }
}
