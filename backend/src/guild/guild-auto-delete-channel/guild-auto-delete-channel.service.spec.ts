import { Test, TestingModule } from '@nestjs/testing';
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

describe('GuildAutoDeleteChannelService', () => {
  let service: GuildAutoDeleteChannelService;
  let client: Client;

  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildAutoDeleteChannelService,
        PrismaService,
        TasksService,
        GuildUserService,
        GuildService,
        EventEmitter2,
        GuildSettingsService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
        GuildRestrictedChannelService,
      ],
    }).compile();

    service = module.get<GuildAutoDeleteChannelService>(
      GuildAutoDeleteChannelService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
