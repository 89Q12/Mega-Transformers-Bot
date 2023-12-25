import { Test, TestingModule } from '@nestjs/testing';
import { GuildRestrictedChannelController } from './guild-restricted-channel.controller';

describe('GuildRestrictedChannelController', () => {
  let controller: GuildRestrictedChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildRestrictedChannelController],
    }).compile();

    controller = module.get<GuildRestrictedChannelController>(
      GuildRestrictedChannelController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
