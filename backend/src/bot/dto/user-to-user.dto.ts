import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { ChoiceOptions } from '@discord-nestjs/core/dist/decorators/option/choice/choice-options';
import { User } from 'discord.js';

const CommandToExecute: ChoiceOptions = {
  'Einer Person einen Kaffee geben': 'coffee',
  'Einer Person einen Kuchen geben': 'cake',
  'Einer Person ein Headpat geben': 'headpat',
  'Eine Person umarmen': 'hug',
};
export class UserToUser {
  @Param({
    description: 'The user you want to give something',
    descriptionLocalizations: {
      'en-US': 'The user you want to give something',
      de: 'Person welcher du etwas geben willst',
    },
    type: ParamType.USER,
    required: true,
  })
  user: User;

  @Choice(CommandToExecute)
  @Param({
    description: 'Was möchtest du einer Person geben?',
    required: true,
  })
  category: string;
}
