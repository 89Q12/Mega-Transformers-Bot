import { Test, TestingModule } from '@nestjs/testing';
import { GuildAutoDeleteChannelController } from './guild-auto-delete-channel.controller';
import { GuildAutoDeleteChannelService } from './guild-auto-delete-channel.service';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GuildUserService } from '../guild-user/guild-user.service';
import { GuildService } from '../guild.service';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';
import { GuildRestrictedChannelService } from '../guild-restricted-channel/guild-restricted-channel.service';

describe('GuildAutoDeleteChannelController', () => {
  let controller: GuildAutoDeleteChannelController;
  let client: Client;

  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildAutoDeleteChannelController],
      providers: [
        GuildAutoDeleteChannelService,
        PrismaService,
        TasksService,
        GuildUserService,
        GuildService,
        EventEmitter2,
        GuildSettingsService,
        GuildRestrictedChannelService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    controller = module.get<GuildAutoDeleteChannelController>(
      GuildAutoDeleteChannelController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
