import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from 'discord.js';

describe('UserController', () => {
  let controller: UserController;
  let client: Client;
  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        PrismaService,
        EventEmitter2,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
