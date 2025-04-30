import { Param, ParamType } from '@discord-nestjs/core';
import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';
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
    if (
      !/\b(\d+d)(\d+h)\b|\b(\d+h)(\d+m)\b|\b(\d+d)(\d+m)\b|\b(\d+[dhm])\b|\b(\d+d)(\d+h)(\d+m)/.test(
        value.trim(),
      )
    )
      return null;
    let _days = '0';
    let _hours = '0';
    let _minutes = '0';
    (value as string)
      .match(
        /\b(\d+d)(\d+h)\b|\b(\d+h)(\d+m)\b|\b(\d+d)(\d+m)\b|\b(\d+[dhm])\b|\b(\d+d)(\d+h)(\d+m)/g,
      )
      .forEach((match) => {
        if (match.endsWith('d')) _days = match.replace('d', '');
        else if (match.endsWith('h')) _hours = match.replace('h', '');
        else if (match.endsWith('m')) _minutes = match.replace('m', '');
      });
    const days = parseInt(_days) || 0;
    const hours = parseInt(_hours) || 0;
    const minutes = parseInt(_minutes) || 0;
    return new Date(
      Date.now() + ((days * 24 + hours) * 60 + minutes) * 60 * 1000,
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
        'The input must be in format: Xd, Xh, Xm or XdXh or XhXm or XdXm or XdXhXm. Where X is a number',
    },
  )
  duration: string;
}
