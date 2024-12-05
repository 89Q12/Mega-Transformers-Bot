import { Test, TestingModule } from '@nestjs/testing';
import { GuildSettingsController } from './guild-settings.controller';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from './guild-settings.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('GuildSettingsController', () => {
  let controller: GuildSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildSettingsController],
      providers: [PrismaService, GuildSettingsService, EventEmitter2],
    }).compile();

    controller = module.get<GuildSettingsController>(GuildSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
