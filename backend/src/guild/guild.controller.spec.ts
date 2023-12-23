import { Test, TestingModule } from '@nestjs/testing';
import { GuildController } from './guild.controller';

describe('GuildController', () => {
  let controller: GuildController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildController],
    }).compile();

    controller = module.get<GuildController>(GuildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
