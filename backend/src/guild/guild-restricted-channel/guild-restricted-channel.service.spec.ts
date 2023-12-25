import { Test, TestingModule } from '@nestjs/testing';
import { GuildRestrictedChannelService } from './guild-restricted-channel.service';

describe('GuildRestrictedChannelService', () => {
  let service: GuildRestrictedChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildRestrictedChannelService],
    }).compile();

    service = module.get<GuildRestrictedChannelService>(GuildRestrictedChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
