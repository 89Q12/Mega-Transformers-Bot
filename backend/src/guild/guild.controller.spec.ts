import { Test, TestingModule } from '@nestjs/testing';
import { GuildController } from './guild.controller';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { GuildService } from './guild.service';
import { PrismaService } from 'src/prisma.service';
import { GuildRestrictedChannelService } from './guild-restricted-channel/guild-restricted-channel.service';

describe('GuildController', () => {
  let controller: GuildController;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildController],
      providers: [
        GuildService,
        PrismaService,
        GuildRestrictedChannelService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    controller = module.get<GuildController>(GuildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
