import { Test, TestingModule } from '@nestjs/testing';
import { ChannelController } from './channel.controller';
import { PrismaService } from 'src/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';

describe('ChannelController', () => {
  let controller: ChannelController;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        PrismaService,
        EventEmitter2,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    controller = module.get<ChannelController>(ChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
