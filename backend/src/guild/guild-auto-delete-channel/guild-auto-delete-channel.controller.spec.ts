import { Test, TestingModule } from '@nestjs/testing';
import { GuildAutoDeleteChannelController } from './guild-auto-delete-channel.controller';

describe('GuildAutoDeleteChannelController', () => {
  let controller: GuildAutoDeleteChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildAutoDeleteChannelController],
    }).compile();

    controller = module.get<GuildAutoDeleteChannelController>(
      GuildAutoDeleteChannelController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
