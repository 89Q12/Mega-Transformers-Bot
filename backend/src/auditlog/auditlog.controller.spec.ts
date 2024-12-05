import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogController } from './auditlog.controller';
import { PrismaService } from 'src/prisma.service';
import { AuditLogService } from './auditlog.service';

describe('AuditLogController', () => {
  let controller: AuditLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogController],
      providers: [PrismaService, AuditLogService],
    }).compile();

    controller = module.get<AuditLogController>(AuditLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
