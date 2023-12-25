import { Test, TestingModule } from '@nestjs/testing';
import { GuildSettingsService } from './guild-settings.service';

describe('GuildSettingsService', () => {
  let service: GuildSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildSettingsService],
    }).compile();

    service = module.get<GuildSettingsService>(GuildSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
