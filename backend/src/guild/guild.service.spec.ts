import { Test, TestingModule } from '@nestjs/testing';
import { GuildService } from './guild.service';
import { PrismaService } from 'src/prisma.service';
import { GuildRestrictedChannelService } from './guild-restricted-channel/guild-restricted-channel.service';
import { Client } from 'discord.js';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';

describe('GuildService', () => {
  let service: GuildService;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildService,
        PrismaService,
        GuildRestrictedChannelService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    service = module.get<GuildService>(GuildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
