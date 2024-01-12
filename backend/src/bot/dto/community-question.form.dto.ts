import { Field } from '@discord-nestjs/core';
import { TextInputModalData } from 'discord.js';

export class CommunityQuestionFormDto {
  @Field('answer')
  answer: TextInputModalData;
}
