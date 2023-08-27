import { ApiProperty } from '@nestjs/swagger';

class DiscordUser {
  @ApiProperty({
    type: String,
    description: 'The id of the user',
    example: '123456789012345678',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The username of the user',
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    type: String,
    description: 'The discriminator of the user but now ITS ALWAYS 0',
    example: '1234',
  })
  discriminator: string;

  @ApiProperty({
    type: String,
    description: 'The avatar url of the user',
  })
  avatarURL: string;

  @ApiProperty({
    type: String,
    description: 'The display avatar url of the user',
  })
  displayAvatarURL: string;

  @ApiProperty({
    type: String,
    description: 'The banner url of the user',
  })
  bannerURL: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether or not the user is a bot',
    example: false,
  })
  bot: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Whether or not the user is a system user',
    example: false,
  })
  system: boolean;

  @ApiProperty({
    type: Number,
    description: 'The flags of the user',
    example: 0,
  })
  flags: number;

  @ApiProperty({
    type: Number,
    description: 'The created timestamp of the user',
    example: 0,
  })
  createdTimestamp: number;

  @ApiProperty({
    type: Number,
    description: 'The accent color of the user',
    example: 0,
  })
  accentColor: number;

  @ApiProperty({
    type: String,
    description: 'The hex accent color of the user',
    example: '#000000',
  })
  hexAccentColor: string;
}
const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    discriminator: { type: 'string' },
    avatarURL: { type: 'string' },
    displayAvatarURL: { type: 'string' },
    bannerURL: { type: 'string' },
    bot: { type: 'boolean' },
    system: { type: 'boolean' },
    flags: { type: 'number' },
    createdTimestamp: { type: 'number' },
    accentColor: { type: 'number' },
    hexAccentColor: { type: 'string' },
  },
};
const usersResponseSchema = {
  type: 'array',
  items: userResponseSchema,
};
export { DiscordUser, userResponseSchema, usersResponseSchema };
