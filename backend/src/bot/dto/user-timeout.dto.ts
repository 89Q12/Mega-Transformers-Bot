import { Param, ParamType } from '@discord-nestjs/core';
import { Transform } from 'class-transformer';
import { IsDateString, IsObject, Matches, Validate } from 'class-validator';
import { User } from 'discord.js';

export default class UserTimeOutDto {
  @Param({
    description: 'The user to timeout',
    descriptionLocalizations: {
      'en-US': 'The user to timeout',
      de: 'Account der gemutet werden soll',
    },
    type: ParamType.USER,
    required: true,
  })
  user: User;

  @Param({
    description: 'The reason for the timeout',
    descriptionLocalizations: {
      'en-US': 'The reason for the timeout',
      de: 'Grund für den Timeout',
    },
    type: ParamType.STRING,
    required: true,
  })
  reason: string;

  // Hacky way to both transform the value and validate it, in one step :D
  @Transform(({ value }) => {
    console.log(value);
    if (!/\b(\d{1,}[d])|(\d{1,}[h])\b/.test(value.trim())) return null;
    value = value.replace('h', '') as string;
    value = value.replace('d', ' ') as string;
    const [_days, _hours] = value.split(' ') as Array<string>;
    const days = parseInt(_days) || 0;
    const hours = parseInt(_hours) || 0;
    const millis = Date.now() + (days * 24 + hours) * 60 * 60 * 1000;
    const date = new Date();
    // If the date is more than 14 days in the future (the maximum for a timeout), return null
    if (millis - date.getTime() > 14 * 24 * 60 * 60 * 1000) return null;
    date.setMilliseconds(millis);
    return new Date(
      Date.now() + (days * 24 + hours) * 60 * 60 * 1000,
    ).toISOString();
  })
  @Param({
    description: 'The duration of the timeout',
    descriptionLocalizations: {
      'en-US': 'The duration of the timeout',
      de: 'Dauer des Timeouts',
    },
    type: ParamType.STRING,
    required: true,
  })
  @IsDateString(
    {},
    {
      message:
        'The input must be in format: Xd, Xh or XdXh. Where X is a number',
    },
  )
  duration: string;
}
