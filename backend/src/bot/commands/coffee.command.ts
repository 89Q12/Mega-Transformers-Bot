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
  @Handler()
  chooseRandomCoffee(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe)
    dto: UserToUser,
  ): string {
    console.log(dto);
    return `*${userMention(interaction.user.id)} schiebt ${userMention(dto.user.id)} einen ${this.coffees[Math.ceil(Math.random() * this.coffees.length - 1)]} rüber!*`;
  }
}
