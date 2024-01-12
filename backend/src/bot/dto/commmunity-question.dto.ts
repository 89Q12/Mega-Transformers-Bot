import { Param, ParamType } from '@discord-nestjs/core';
import { IsOptional, IsString } from 'class-validator';

export class CommunityQuestionDto {
  @Param({
    description: 'The question you want to ask the community',
    type: ParamType.STRING,
    required: true,
  })
  @IsString()
  question: string;

  @Param({
    description:
      'Description about the question displayed above the text input int the modal',
    type: ParamType.STRING,
    required: true,
  })
  @IsString()
  description: string;
}
