import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInstance,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ChannelType,
  CategoryChannelResolvable,
  CategoryChannel,
} from 'discord.js';

class PermissionOverwrite {
  @IsString()
  @ApiProperty({ description: 'ID of the permission overwrite' })
  id: string;
}

class Channel {
  @IsNumber()
  @ApiProperty({ description: 'Type of the channel', type: Number })
  type: number;

  @IsString()
  @ApiProperty({
    description: 'ID of the guild',
    example: '616609333832187924',
    type: String,
  })
  guildId: string;

  @IsInstance(PermissionOverwrite)
  @IsOptional()
  @ApiProperty({
    description: 'Array of permission overwrites',
    type: [PermissionOverwrite],
    required: false,
  })
  permissionOverwrites?: PermissionOverwrite[];

  @IsArray()
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Array of message IDs',
    type: [String],
    example: [],
    required: false,
  })
  messages?: string[];

  @IsArray()
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Array of thread IDs',
    type: [String],
    example: [],
    required: false,
  })
  threads?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the channel is NSFW',
    example: false,
    type: Boolean,
    required: false,
  })
  nsfw?: boolean;

  @IsNumber()
  @ApiProperty({
    description: 'Flags for the channel',
    example: 0,
    type: Number,
  })
  flags: number;

  @IsString()
  @ApiProperty({
    description: 'ID of the channel',
    example: '1056592866660581456',
    type: String,
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the channel',
    example: 'images',
    type: String,
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    description: 'Raw position of the channel',
    example: 3,
    type: Number,
  })
  rawPosition: number;

  @IsString()
  @ApiProperty({
    description: 'ID of the parent channel',
    example: '832170662491062333',
    type: String,
  })
  parentId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Topic of the channel',
    example: null,
    type: String,
  })
  topic?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the last message',
    example: '1080070968900333578',
    type: String,
  })
  lastMessageId?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Rate limit per user aka slowmode',
    example: 0,
    type: Number,
  })
  rateLimitPerUser?: number;

  @IsNumber()
  @ApiProperty({
    description: 'Timestamp when the channel was created',
    example: 1671981769958,
    type: Number,
  })
  createdTimestamp: number;
}

class GuildChannelEditOptions {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'New name of the role',
  })
  name?: string;

  @IsEnum(ChannelType)
  @IsOptional()
  @ApiProperty({
    enum: ChannelType,
    required: false,
    description: 'Change the type of the channel',
  })
  type?: ChannelType.GuildText | ChannelType.GuildAnnouncement;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Topic of the channel',
  })
  topic?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Should the channel be NSFW',
  })
  nsfw?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Slowmode for the channel in seconds',
  })
  userLimit?: number;

  @IsIn([String, null, CategoryChannel])
  @IsOptional()
  @ApiProperty({
    type: CategoryChannel || String || null,
    required: false,
    description: 'Category of the channel',
  })
  parent?: CategoryChannelResolvable | null;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Why was the channel updated/created',
  })
  reason?: string;
}

export { Channel, GuildChannelEditOptions };
