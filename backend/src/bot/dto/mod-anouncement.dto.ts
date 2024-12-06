import { Param, ParamType } from '@discord-nestjs/core';
import { IsString } from 'class-validator';

export class ModAnouncementDto {
  @Param({
    description: 'The message to send',
    descriptionLocalizations: {
      'en-US': 'The message to send',
      de: 'Die Nachricht die gesendet werden soll',
    },
    type: ParamType.STRING,
    required: true,
  })
  @IsString()
  message: string;

  @Param({
    name: 'replyto',
    description: 'Message ID to which the bot should reply(optional)',
    type: ParamType.STRING,
    required: false,
  })
  @IsString()
  replyToMessage: string;
}
