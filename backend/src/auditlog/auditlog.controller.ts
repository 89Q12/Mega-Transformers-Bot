import {
  Controller,
  Get,
  Inject,
  Param,
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
  ): Promise<LogEntryDto[]> {
    return this.auditLogService.find(guildId, filter).then((result) =>
      result.map((it) =>
        plainToInstance(LogEntryDto, {
          action: it.action as Action,
          createdAt: it.createdAt,
          invokerId: it.invokerId,
          reason: it.reason,
          targetId: it.targetId,
          targetType: it.targetType as TargetType,
        }),
      ),
    );
  }
}
