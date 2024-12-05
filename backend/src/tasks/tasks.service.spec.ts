import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { GuildService } from 'src/guild/guild.service';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from 'src/guild/guild-settings/guild-settings.service';
import { GuildRestrictedChannelService } from 'src/guild/guild-restricted-channel/guild-restricted-channel.service';

describe('TasksService', () => {
  let service: TasksService;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        PrismaService,
        GuildUserService,
        GuildSettingsService,
        GuildService,
        EventEmitter2,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
        GuildRestrictedChannelService,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
