import { Test, TestingModule } from '@nestjs/testing';
import { GuildUserController } from './guild-user.controller';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Rank } from '@prisma/client';
import { Client } from 'discord.js';
import { UserController } from 'src/guild/moderation/user/user.controller';
import { SelfService } from 'src/user/self.service';
import { GuildUserService } from './guild-user.service';

describe('GuildUserController', () => {
  let userController: GuildUserController;

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  let userService: GuildUserService;
  let client: Client;
  beforeEach(async () => {
    userService = {} as GuildUserService;
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: SelfService, useValue: userService },
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    userController = module.get<GuildUserController>(GuildUserController);
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
    userService.getGuildUser = jest
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

    expect(
      await userController.getSelf('616609333832187924', '616609333832187924'),
    ).toEqual(result);
  });
});
