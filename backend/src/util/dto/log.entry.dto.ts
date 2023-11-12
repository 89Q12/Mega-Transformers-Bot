import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export const actions = [
  'USER_JOINED',
  'WARN',
  'ERROR',
  'USER_LEFT',
  'USER_BANNED',
  'USER_UNBANNED',
  'USER_UPDATED',
  'GUILD_UPDATED',
  'INVALID_REQUEST',
  'INVITE_CREATED',
  'INVITE_DELETED',
  'MESSAGE_DELETED',
  'REACTION_ADDED',
  'REACTION_REMOVED',
  'ROLE_CREATED',
  'ROLE_DELETED',
  'ROLE_UPDATED',
  'CHANNEL_CREATED',
  'CHANNEL_DELETED',
  'CHANNEL_UPDATED',
  'WEBHOOKS_UPDATED',
  'TIMEOUT_EXPIRED',
  'TIMEOUT',
  'KICK',
  'BAN',
] as const;
export type Action = (typeof actions)[number];

export const targetTypes = [
  'ERROR',
  'WARN',
  'USER',
  'GUILD',
  'INVALID_REQUEST',
  'INVITE',
  'MESSAGE',
  'ROLE',
  'CHANNEL',
] as const;
export type TargetType = (typeof targetTypes)[number];

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
  action: Action;
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
  targetType: TargetType;
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
