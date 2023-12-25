import { Test, TestingModule } from '@nestjs/testing';
import { GuildSettingsController } from './guild-settings.controller';

describe('GuildSettingsController', () => {
  let controller: GuildSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildSettingsController],
    }).compile();

    controller = module.get<GuildSettingsController>(GuildSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
