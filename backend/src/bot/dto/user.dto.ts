import { Param, ParamType } from '@discord-nestjs/core';
import { User } from 'discord.js';

export class TargetUser {
  @Param({
    description: 'The user you want to give something',
    descriptionLocalizations: {
      'en-US': 'The user to delete all messages from',
      de: 'Person von der du alle Nachrichten löschen willst',
    },
    type: ParamType.USER,
    required: true,
  })
  user: User;
}
