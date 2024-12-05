import { Test, TestingModule } from '@nestjs/testing';
import { GuildSettingsService } from './guild-settings.service';
import { PrismaService } from 'src/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('GuildSettingsService', () => {
  let service: GuildSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildSettingsService, PrismaService, EventEmitter2],
    }).compile();

    service = module.get<GuildSettingsService>(GuildSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
