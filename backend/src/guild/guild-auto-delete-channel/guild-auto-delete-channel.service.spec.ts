import { Test, TestingModule } from '@nestjs/testing';
import { GuildAutoDeleteChannelService } from './guild-auto-delete-channel.service';

describe('GuildAutoDeleteChannelService', () => {
  let service: GuildAutoDeleteChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildAutoDeleteChannelService],
    }).compile();

    service = module.get<GuildAutoDeleteChannelService>(
      GuildAutoDeleteChannelService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
