import { Param, ParamType } from '@discord-nestjs/core';
import { IsString } from 'class-validator';
import { User } from 'discord.js';

export class UserToUser {
  @Param({
    description: 'The user you want to give something',
    descriptionLocalizations: {
      'en-US': 'The user you want to give something',
      de: 'Account dem du etwas geben willst',
    },
    type: ParamType.USER,
    required: true,
  })
  @IsString()
  touser: User;
}