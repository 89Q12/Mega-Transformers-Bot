import { InjectDiscordClient } from '@discord-nestjs/core';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Base64Resolvable,
  Base64String,
  BufferResolvable,
  Client,
  ColorResolvable,
  Colors,
  EmojiResolvable,
  GuildBasedChannel,
  GuildChannel,
  GuildEmoji,
  PermissionFlagsBits,
  PermissionResolvable,
  ReactionEmoji,
  Role,
  RoleEditOptions,
  Snowflake,
  User,
} from 'discord.js';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';

class EditRoleData {
  @ApiProperty({
    type: String,
    required: false,
    description: 'New name of the role',
  })
  name?: string;
  @ApiProperty({
    enum: Colors,
    required: false,
    description: 'New color of the role',
  })
  color?: ColorResolvable;
  @ApiProperty({
    type: String,
    required: true,
    description: 'Why was the role updated',
  })
  reason: string;
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Whether or not the role should be hoisted',
  })
  hoist?: boolean;
  @ApiProperty({
    type: Number,
    required: false,
    description:
      'The position of the role; Higher = more permissions relative to the role below',
  })
  position?: number;
  @ApiProperty({
    type: Array<keyof typeof PermissionFlagsBits>,
    required: false,
    description: 'Updated Permission',
    default: null,
    example: ['AddReactions', 'KickMembers'],
  })
  permissions?: PermissionResolvable;
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Should the role be mentionable or not',
  })
  mentionable?: boolean;
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
  @ApiProperty({
    type: String,
    required: false,
    description: 'The new unicodeEmoji of the role',
  })
  unicodeEmoji?: string | null;
}

/*
  Bot API, this allows the frontend to interact with the discord api
*/
@Controller('bot')
export class BotController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Get('guild/:guildId/users')
  async getGuildUsers(@Param('guildId') guildId: string): Promise<User[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    return members.map((member) => member.user);
  }

  @Get('guild/:guildId/channels')
  async getGuildChannels(
    @Param('guildId') guildId: string,
  ): Promise<GuildChannel[]> {
    const guild = await this.client.guilds.fetch(guildId);
    return (await guild.channels.fetch()).toJSON();
  }

  @Put('guild/:guildId/channel/:channelId')
  async editChannel(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() channelData: Partial<Record<string, unknown>>,
  ): Promise<GuildBasedChannel> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    await channel.edit(channelData);
    return channel;
  }

  @Post('guild/:guildId/user/:userId/ban')
  async banUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.ban(userId);
  }

  @Post('guild/:guildId/user/:userId/kick')
  async kickUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.kick(userId);
  }

  @Post('guild/:guildId/user/:userId/timeout')
  async timeoutUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    await member.voice.setMute(true);
  }

  @Post('guild/:guildId/channel/:channelId/slowmode')
  async setSlowmode(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() { duration }: { duration: number },
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId) as GuildChannel;
    await channel.edit({ rateLimitPerUser: duration });
  }

  @Get('guild/:guildId/roles')
  async getGuildRoles(@Param('guildId') guildId: string): Promise<Role[]> {
    const guild = await this.client.guilds.fetch(guildId);
    return (await guild.roles.fetch()).toJSON();
  }

  @Put('guild/:guildId/role/:roleId')
  async updateRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
    @Body() roleData: EditRoleData,
  ): Promise<Role> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    await role.edit(roleData);

    return role;
  }

  @Delete('guild/:guildId/role/:roleId')
  async deleteRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    await role.delete();
  }
}
