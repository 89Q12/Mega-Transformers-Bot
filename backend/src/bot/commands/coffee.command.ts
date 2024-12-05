import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Client, CommandInteraction, userMention } from 'discord.js';
import { UserToUser } from '../dto/user-to-user.dto';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { ValidationPipe } from '@nestjs/common';

const coffees = [
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

@Command({
  name: 'coffee',
  description: 'Give a user you like a coffee',
  defaultMemberPermissions: ['SendMessages'],
  dmPermission: false,
})
export class CoffeeCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  @Handler()
  chooseRandomCoffee(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe)
    dto: UserToUser,
  ): string {
    return `*${userMention(interaction.user.id)} schiebt ${dto.touser} einen ${coffees[Math.ceil(Math.random() * coffees.length - 1)]} rüber!*`;
  }
}
