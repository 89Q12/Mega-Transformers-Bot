import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeCommand } from './coffee.command';
import { ReflectMetadataProvider } from '@discord-nestjs/core';
import { UserToUser } from '../dto/user-to-user.dto';
import { CommandInteraction, User } from 'discord.js';
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
    };
    command.coffees = ['Americano'];
    expect(
      command.chooseRandomCoffee(
        {
          user: {
            id: '12345678',
          } as User,
        } as CommandInteraction,
        dto,
      ),
    ).toEqual('*<@12345678> schiebt <@12345678> einen Americano rüber!*');
  });
});
