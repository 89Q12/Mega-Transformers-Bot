import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export default class LogEntry {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The guild id where the event occurred',
  })
  guildId: string;
  @IsString()
  @ApiProperty({ type: String, description: 'The user id of the invoker' })
  invokerId: string;
  @IsString()
  @ApiProperty({ type: String, description: 'The action that was performed' })
  action: string;
  @IsString()
  @ApiProperty({
    type: String,
    description:
      'The reason for the action, most likely just a different wording of action',
  })
  reason: string;
  @IsDate()
  @ApiProperty({ type: Date, description: 'The date when the event occurred' })
  createdAt: Date;
  @IsString()
  @ApiProperty({
    type: String,
    description:
      'The id of the target, can be one of: \
       message id, \
       channel id, \
       role id, \
       guild id, \
       user id, \
       invite code \
       or a webhook id',
  })
  targetId: string;
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Describe the type of the target id',
  })
  targetType: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description:
      'Contains the involved object, if its an update event it contains the old object as well as the new object und old/new key',
  })
  extraInfo?: string;
}
