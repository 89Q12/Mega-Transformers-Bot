import { Module } from '@nestjs/common';
import { AuditLogController } from './auditlog.controller';
import { AuditLogService } from './auditlog.service';
import { DiscordModule } from '@discord-nestjs/core';
import { PrismaService } from 'src/prisma.service';
import AuditEvents from './auditlog.events';

@Module({
  controllers: [AuditLogController],
  providers: [AuditLogService, PrismaService, AuditEvents],
  imports: [DiscordModule.forFeature()],
  exports: [AuditLogService],
})
export class AuditLogModule {}
