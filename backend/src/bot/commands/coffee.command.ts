import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { CommandInteraction, userMention } from 'discord.js';
import { UserToUser } from '../dto/user-to-user.dto';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { UseFilters, ValidationPipe } from '@nestjs/common';
import { CommandValidationFilter } from '../filters/command-validation';

@Command({
  name: 'coffee',
  description: 'Give a user you like a coffee',
  defaultMemberPermissions: ['SendMessages'],
  dmPermission: false,
})
@UseFilters(CommandValidationFilter)
export class CoffeeCommand {
  coffees = [
    'Americano',
    'Cappuccino',
    'Diplomatenkaffee',
    'Einspänner',
    'Eiskaffee',
    'Espresso',
    'Irish Coffee',
    'Kaffee Konsul',
    'Latte Macchiato',
    'Mokka',
    'Pharisäer',
  ];
  possibleAnswers = [
    '*Y schiebt X einen Z rüber!*',
    '*Y schenkt X einen ganzen Kuchen!*',
    '*Y gibt X ein headpat :3*',
    '*Y umarmt X :3*',
  ];
  @Handler()
  async chooseRandomCoffee(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe)
    dto: UserToUser,
  ): Promise<string> {
    const toUser = await interaction.guild.members.fetch(dto.user);
    return this.templateAnswer(dto.category, interaction.user.id, toUser.id);
  }

  templateAnswer(category: string, fromUserId: string, toUserId: string) {
    console.log(category);
    console.log(fromUserId);
    console.log(toUserId);

    switch (category) {
      case 'coffee':
        return this.possibleAnswers[0]
          .replace('Y', userMention(fromUserId))
          .replace('X', userMention(toUserId))
          .replace(
            'Z',
            this.coffees[Math.ceil(Math.random() * this.coffees.length - 1)],
          );

      default:
        break;
    }
  }
}
