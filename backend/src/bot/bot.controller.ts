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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CategoryChannelResolvable,
  ChannelType,
  Client,
  GuildBasedChannel,
  GuildChannel,
  Role,
  User,
} from 'discord.js';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import {
  EditRoleData,
  RoleResponse,
  roleResponseSchema,
  rolesResponseSchema,
} from './entities/role';

class GuildChannelEditOptions {
  @ApiProperty({
    type: String,
    required: false,
    description: 'New name of the role',
  })
  name?: string;
  @ApiProperty({
    enum: ChannelType,
    required: false,
    description: 'Change the type of the channel',
  })
  type?: ChannelType.GuildText | ChannelType.GuildAnnouncement;
  @ApiProperty({
    type: String,
    required: false,
    description: 'Topic of the channel',
  })
  topic?: string | null;
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Should the channel be NSFW',
  })
  nsfw?: boolean;
  userLimit?: number;
  parent?: CategoryChannelResolvable | null;
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Slowmode for the channel in seconds',
  })
  @ApiProperty({
    type: String,
    required: false,
    description: 'Why was the channel updated/created',
  })
  reason?: string;
}

/*
  Bot API, this allows the frontend to interact with the discord api
*/
@Controller('bot')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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

  @Get('guild/:guildId/channel')
  @ApiOperation({ summary: 'Get all channels for a guild' })
  async getGuildChannels(
    @Param('guildId') guildId: string,
  ): Promise<GuildChannel[]> {
    const guild = await this.client.guilds.fetch(guildId);
    return (await guild.channels.fetch()).toJSON();
  }

  @Put('guild/:guildId/channel/:channelId')
  @ApiOperation({ summary: 'Edit a channel for a guild' })
  async editChannel(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() channelData: GuildChannelEditOptions,
  ): Promise<GuildBasedChannel> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    await channel.edit(channelData);
    return channel;
  }

  @Post('guild/:guildId/user/:userId/ban')
  @ApiOperation({ summary: 'Ban a user from a guild' })
  async banUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.ban(userId);
  }

  @Post('guild/:guildId/user/:userId/kick')
  @ApiOperation({ summary: 'Kick a user from a guild' })
  async kickUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.kick(userId);
  }

  @Post('guild/:guildId/user/:userId/timeout')
  @ApiOperation({ summary: 'Timeout a user from a guild' })
  async timeoutUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    await member.voice.setMute(true);
  }

  @Post('guild/:guildId/channel/:channelId/slowmode')
  @ApiOperation({ summary: 'Set slowmode for a channel' })
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
  @ApiOperation({ summary: 'Get all roles for a guild' })
  @ApiResponse({
    status: 200,
    type: [RoleResponse],
    schema: rolesResponseSchema,
    description: 'Roles were successfully fetched',
  })
  @ApiResponse({
    status: 500,
    description: 'Roles could not be successfully fetched',
  })
  async getGuildRoles(@Param('guildId') guildId: string): Promise<Role[]> {
    const guild = await this.client.guilds.fetch(guildId);
    return (await guild.roles.fetch()).toJSON();
  }
  @Post('guild/:guildId/role/')
  @ApiOperation({ summary: 'Create a role for a guild' })
  @ApiResponse({
    status: 200,
    type: RoleResponse,
    schema: roleResponseSchema,
    description: 'Role was successfully created',
  })
  @ApiResponse({
    status: 500,
    description: 'Role could not be successfully created',
  })
  async createRole(
    @Param('guildId') guildId: string,
    @Body() roleData: EditRoleData,
  ): Promise<Role> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = await guild.roles.create(roleData);
    return role;
  }
  @Put('guild/:guildId/role/:roleId')
  @ApiOperation({ summary: 'Update a role for a guild' })
  @ApiResponse({
    status: 200,
    type: RoleResponse,
    schema: roleResponseSchema,
    description: 'Role was successfully updated',
  })
  @ApiResponse({
    status: 500,
    description: 'Role could not be successfully updated',
  })
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
  @ApiOperation({ summary: 'Delete a role for a guild' })
  @ApiResponse({
    status: 200,
    type: RoleResponse,
    description: 'Role was successfully deleted',
  })
  @ApiResponse({
    status: 500,
    description: 'Role could not be successfully deleted',
  })
  async deleteRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    await role.delete();
  }
}
