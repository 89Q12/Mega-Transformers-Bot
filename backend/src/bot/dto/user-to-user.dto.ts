import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { ChoiceOptions } from '@discord-nestjs/core/dist/decorators/option/choice/choice-options';
import { User } from 'discord.js';

const CommandToExecute: ChoiceOptions = {
  coffee: 'Einer Person einen Kaffee geben',
  cake: 'Einer Person einen Kuchen geben',
  headpat: 'Einer Person ein Headpat geben',
  hug: 'Eine Person umarmen',
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
