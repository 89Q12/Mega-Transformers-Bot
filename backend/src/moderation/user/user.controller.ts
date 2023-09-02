import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChannelType, Client, User } from 'discord.js';
import {
  DiscordUser,
  usersResponseSchema,
  userResponseSchema,
} from '../../entities/user';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';

@ApiTags('discord/user')
@Controller('discord/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  @Get(':guildId/users')
  @ApiOperation({ summary: 'Get all users for a guild' })
  @ApiResponse({
    status: 200,
    type: [DiscordUser],
    schema: usersResponseSchema,
    description: 'Users were successfully fetched',
  })
  async getGuildUsers(@Param('guildId') guildId: string): Promise<User[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    return members.map((member) => member.user);
  }

  @Get(':guildId/user/:userId')
  @ApiOperation({ summary: 'Get a user for a guild' })
  @ApiResponse({
    status: 200,
    type: DiscordUser,
    schema: userResponseSchema,
    description: 'User was successfully fetched',
  })
  async getGuildUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<User> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    return member.user;
  }
  @Post(':guildId/user/:userId/ban')
  @ApiOperation({ summary: 'Ban a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully banned',
  })
  async banUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.ban(userId);
  }

  @Post(':guildId/user/:userId/kick')
  @ApiOperation({ summary: 'Kick a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully kicked',
  })
  async kickUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.kick(userId);
  }

  @Post(':guildId/user/:userId/timeout')
  @ApiOperation({ summary: 'Timeout a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully timed outed',
  })
  async timeoutUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    await member.voice.setMute(true);
  }

  @Post(':guildId/user/:userId/purge')
  @ApiOperation({
    summary: 'Purge a user from a guild VERY EXPENSIVEEEEEE, USE WITH CAUTION',
  })
  @ApiResponse({
    status: 200,
    description: 'User was successfully purged',
  })
  async purgeUserFromGuild(guildId: string, userId: string): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    if (guild === undefined) {
      throw new NotFoundException('Guild not found');
    }
    const member = await guild.members.fetch(userId);
    if (member === undefined) {
      throw new NotFoundException('User not found');
    }
    guild.channels.cache.forEach(async (channel) => {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.PublicThread ||
        channel.type === ChannelType.PrivateThread
      ) {
        const messages = await channel.messages.fetch();
        const userMessages = messages.filter(
          (message) => message.author.id === userId,
        );
        userMessages.forEach(async (message) => {
          await message.delete();
          // sleep for 1 second to avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 500));
        });
      }
    });
  }
}
