import { Test, TestingModule } from '@nestjs/testing';
import { GuildRestrictedChannelService } from './guild-restricted-channel.service';
import { PrismaService } from 'src/prisma.service';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';

describe('GuildRestrictedChannelService', () => {
  let service: GuildRestrictedChannelService;
  let client: Client;

  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildRestrictedChannelService,
        PrismaService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    service = module.get<GuildRestrictedChannelService>(
      GuildRestrictedChannelService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
