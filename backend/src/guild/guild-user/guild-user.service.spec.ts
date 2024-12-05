import { Test, TestingModule } from '@nestjs/testing';
import { GuildUserService } from './guild-user.service';
import { PrismaService } from 'src/prisma.service';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('GuildUserService', () => {
  let service: GuildUserService;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildUserService,
        PrismaService,
        GuildSettingsService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
        EventEmitter2,
      ],
    }).compile();

    service = module.get<GuildUserService>(GuildUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
