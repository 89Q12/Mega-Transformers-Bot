import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';
import { AuditLogService } from './auditlog.service';
import { LogEntryDto } from './dto/log-entry.dto';
import { plainToInstance } from '../util/functions/plain-to-instance';
import { Action, TargetType } from '../util/dto/log.entry.dto';
import { Rank } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { RequiredRank } from 'src/util/decorators/requires-rank.decorator';
import { HasRequiredRank } from 'src/util/guards/has-required-rank.guard';

@Controller()
@RequiredRank(Rank.MEMBER)
@UseGuards(JwtAuthGuard, HasRequiredRank)
export class AuditLogController {
  constructor(
    @Inject(AuditLogService) private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
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
