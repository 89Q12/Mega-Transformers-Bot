import { Test, TestingModule } from '@nestjs/testing';
import { GuildUserService } from './guild-user.service';

describe('GuildUserService', () => {
  let service: GuildUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildUserService],
    }).compile();

    service = module.get<GuildUserService>(GuildUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
