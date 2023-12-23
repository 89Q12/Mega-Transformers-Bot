import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInstance,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  Colors,
  ColorResolvable,
  PermissionFlagsBits,
  PermissionResolvable,
  Base64Resolvable,
  EmojiResolvable,
} from 'discord.js';

class RoleResponse {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The guild the api belongs to',
    example: '123456789012345678',
  })
  guild: string;

  @IsUrl()
  @ApiProperty({
    type: String,
    description: 'The icon of the role',
    example: 'https://cdn.discordapp.com/emojis/859111454677139476.webp',
  })
  icon: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The unicodeEmoji of the role',
    example: '👑',
  })
  unicodeEmoji: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The id of the role',
    example: '123456789012345678',
  })
  id: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The name of the role',
    example: 'Admin',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The color of the role',
    example: 0,
  })
  color: number;

  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'Whether or not the role is hoisted',
    example: false,
  })
  hoist: boolean;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The position of the role',
    example: 0,
  })
  rawPosition: number;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The permissions of the role',
    example: '0',
  })
  permissions: string;

  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'Whether or not the role is managed by an integration',
    example: false,
  })
  managed: boolean;

  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'Whether or not the role is mentionable',
    example: false,
  })
  mentionable: boolean;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The tags of the role',
    example: null,
  })
  tags: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The timestamp the role was created at(Unixtimestamp)',
    example: 1600000000000,
  })
  createdTimestamp: number;
}

class EditRoleData {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'New name of the role',
  })
  name?: string;

  @IsIn(Object.keys(Colors))
  @ApiProperty({
    enum: Colors,
    required: false,
    example: 'White',
    examples: Object.keys(Colors),
    description: 'New color of the role',
  })
  color?: ColorResolvable;

  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'Why was the role updated',
  })
  reason: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Whether or not the role should be hoisted',
  })
  hoist?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description:
      'The position of the role; Higher = more permissions relative to the role below',
  })
  position?: number;

  @IsIn(Object.keys(PermissionFlagsBits))
  @IsOptional()
  @ApiProperty({
    type: Array<keyof typeof PermissionFlagsBits>,
    required: false,
    description: 'Updated Permission',
    default: null,
    example: ['AddReactions', 'KickMembers'],
  })
  permissions?: PermissionResolvable;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Should the role be mentionable or not',
  })
  mentionable?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'New Icon of the role, base64 encoded string',
    externalDocs: {
      description: 'Discord.js docs',
      url: 'https://old.discordjs.dev/#/docs/discord.js/main/class/Role?scrollTo=setIcon',
    },
  })
  icon?: Base64Resolvable | EmojiResolvable | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The new unicodeEmoji of the role',
  })
  unicodeEmoji?: string | null;
}
// Generate example schema for get /guilds/:guildId/roles/:roleId
const roleResponseSchema = {
  type: 'object',
  properties: {
    guild: {
      type: 'string',
      example: '123456789012345678',
    },
    icon: {
      type: 'string',
      example: 'https://cdn.discordapp.com/emojis/859111454677139476.webp',
    },
    unicodeEmoji: {
      type: 'string',
      example: '👑',
    },
    id: {
      type: 'string',
      example: '123456789012345678',
    },
    name: {
      type: 'string',
      example: 'Admin',
    },
    color: {
      type: 'number',
      example: 0,
    },
    hoist: {
      type: 'boolean',
      example: false,
    },
    rawPosition: {
      type: 'number',
      example: 0,
    },
    permissions: {
      type: 'string',
      example: '0',
    },
    managed: {
      type: 'boolean',
      example: false,
    },
    mentionable: {
      type: 'boolean',
      example: false,
    },
    tags: {
      type: 'string',
      example: null,
    },
    createdTimestamp: {
      type: 'number',
      example: 1600000000000,
    },
  },
};
// Schema for retrieving all roles from a guild with example data
const rolesResponseSchema = {
  type: 'array',
  items: roleResponseSchema,
  example: [
    {
      guild: '616609333832187924',
      icon: null,
      unicodeEmoji: null,
      id: '616609333832187924',
      name: '@everyone',
      color: 0,
      hoist: false,
      rawPosition: 0,
      permissions: '559623534870528',
      managed: false,
      mentionable: false,
      tags: null,
      createdTimestamp: 1567081521233,
    },
  ],
};

// Write exports here
export { RoleResponse, EditRoleData, roleResponseSchema, rolesResponseSchema };
