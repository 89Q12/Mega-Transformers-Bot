import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { CommandInteraction, userMention } from 'discord.js';
import { UserToUser } from '../dto/user-to-user.dto';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { UseFilters, ValidationPipe } from '@nestjs/common';
import { CommandValidationFilter } from '../filters/command-validation';

@Command({
  name: 'special',
  description:
    'Give a user you like a coffee, a cake or a headpat or maybe just a hug?',
  dmPermission: false,
})
@UseFilters(CommandValidationFilter)
export class SpecialCommand {
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
    '*Y schenkt X einen ganzen Z!*',
    '*Y gibt X ein headpat :3*',
    '*Y gibt X eine Umarmung :3*',
  ];
  cakes = [
    'Käsekuchen',
    'Apfelkuchen',
    'Bienenstich',
    'Streuselkuchen',
    'Kuchen',
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
      case 'cake':
        return this.possibleAnswers[1]
          .replace('Y', userMention(fromUserId))
          .replace('X', userMention(toUserId))
          .replace(
            'Z',
            this.cakes[Math.ceil(Math.random() * this.cakes.length - 1)],
          );
      case 'headpat':
        return this.possibleAnswers[2]
          .replace('Y', userMention(fromUserId))
          .replace('X', userMention(toUserId));
      case 'hug':
        return this.possibleAnswers[3]
          .replace('Y', userMention(fromUserId))
          .replace('X', userMention(toUserId));
      default:
        break;
    }
  }
}
