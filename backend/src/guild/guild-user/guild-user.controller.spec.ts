import { Test, TestingModule } from '@nestjs/testing';
import { GuildUserController } from './guild-user.controller';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Rank } from '@prisma/client';
import { Client } from 'discord.js';
import { SelfService } from 'src/user/self.service';
import { GuildUserService } from './guild-user.service';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsService } from '../guild-settings/guild-settings.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('GuildUserController', () => {
  let userController: GuildUserController;
  let userService: GuildUserService;
  let client: Client;

  beforeEach(async () => {
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildUserController],
      providers: [
        PrismaService,
        GuildUserService,
        SelfService,
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
        GuildSettingsService,
        EventEmitter2,
      ],
    }).compile();

    userController = module.get<GuildUserController>(GuildUserController);
    userService = module.get<GuildUserService>(GuildUserService);
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
      guildName: 'Example Guild Name',
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
    client.guilds = {} as Client['guilds'];
    client.guilds.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        members: {
          fetch: jest.fn().mockImplementation(() => {
            return {
              avatarURL: jest
                .fn()
                .mockImplementation(() => 'https://example.com/avatar.png'),
              displayName: result.name,
              guild: { name: result.guildName },
            };
          }),
        },
      }),
    );

    expect(
      await userController.getSelf('616609333832187924', '616609333832187924'),
    ).toEqual(result);
  });
});
