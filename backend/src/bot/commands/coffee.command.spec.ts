import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeCommand } from './coffee.command';
import { ReflectMetadataProvider } from '@discord-nestjs/core';
import { UserToUser } from '../dto/user-to-user.dto';
import {
  CommandInteraction,
  Guild,
  GuildMemberManager,
  User,
} from 'discord.js';
describe('CoffeeCommand', () => {
  let command: CoffeeCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeeCommand, ReflectMetadataProvider],
    }).compile();

    command = module.get<CoffeeCommand>(CoffeeCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
  it('should correctly mention users', () => {
    const dto: UserToUser = {
      user: {
        id: '12345678',
      } as User,
      category: 'coffee',
    };
    command.coffees = ['Americano'];
    expect(
      command.chooseRandomCoffee(
        {
          user: {
            id: '12345678',
          } as User,
          guild: {
            members: {
              fetch: jest.fn().mockImplementation(() => {
                return {
                  id: '12345678',
                };
              }),
            } as unknown as GuildMemberManager,
          } as Guild,
        } as CommandInteraction,
        dto,
      ),
    ).toEqual(
      Promise.resolve(
        '*<@12345678> schiebt <@12345678> einen Americano rüber!*',
      ),
    );
  });
});
