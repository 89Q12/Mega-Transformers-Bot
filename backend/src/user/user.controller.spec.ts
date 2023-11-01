import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Rank } from '@prisma/client';
import { Client } from 'discord.js';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let client: Client;
  beforeEach(async () => {
    userService = {} as UserService;
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should return an array of users', async () => {
    const result = {
      userId: '616609333832187924',
      name: 'John Doe',
      guildId: '616609333832187924',
      rank: Rank.MEMBER,
      avatarUrl: 'https://example.com/avatar.png',
    };
    userService.findOne = jest
      .fn()
      .mockImplementation(() => Promise.resolve(result));
    client.users = {} as Client['users'];
    client.users.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        avatarURL: jest
          .fn()
          .mockImplementation(() =>
            Promise.resolve('https://example.com/avatar.png'),
          ),
      }),
    );

    expect(await userController.getSelf('616609333832187924')).toEqual(result);
  });
});
