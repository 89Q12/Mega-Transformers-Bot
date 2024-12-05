import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { PrismaService } from 'src/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from 'discord.js';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';

describe('RoleController', () => {
  let controller: RoleController;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        PrismaService,
        EventEmitter2,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
