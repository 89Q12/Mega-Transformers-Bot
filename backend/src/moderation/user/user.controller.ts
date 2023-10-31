import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  NotFoundException,
  Req,
  Inject,
  Logger,
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
} from '../dto/user';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import LogEntry from 'src/util/dto/log.entry.dto';
import { AuditLogService } from 'src/auditlog/auditlog.service';

const logger = new Logger('UserController');
@ApiTags('discord/user')
@Controller('discord/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(AuditLogService) private auditLogService: AuditLogService,
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
    logger.log(`Found ${members.size} members in guild ${guildId}`);
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
    logger.log(`Found member ${member.user.username} in guild ${guildId}`);
    return member.user;
  }
  @Post(':guildId/user/:userId/ban')
  @ApiOperation({ summary: 'Ban a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully banned',
  })
  async banUser(
    @Req() req,
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.ban(userId);
    logger.log(`Banned user ${userId} from guild ${guildId}`);
    const logEntry: LogEntry = {
      action: 'BAN',
      invokerId: req.user.user.user_id,
      reason: 'Ban',
      guildId: guildId,
      targetId: userId,
      targetType: 'USER',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @Post(':guildId/user/:userId/kick')
  @ApiOperation({ summary: 'Kick a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully kicked',
  })
  async kickUser(
    @Req() req,
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    await guild.members.kick(userId);
    logger.log(`Kicked user ${userId} from guild ${guildId}`);
    const logEntry: LogEntry = {
      action: 'KICK',
      invokerId: req.user.user.user_id,
      reason: 'Kick',
      guildId: guildId,
      targetId: userId,
      targetType: 'USER',
      createdAt: new Date(),
    };
    await this.auditLogService.create(logEntry);
  }

  @Post(':guildId/user/:userId/timeout')
  @ApiOperation({ summary: 'Timeout a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully timed outed',
  })
  async timeoutUser(
    @Req() req,
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
    @Param('duration') duration: number,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    const logEntry: LogEntry = {
      action: 'TIMEOUT',
      invokerId: req.user.user.user_id,
      reason: 'Timeout',
      guildId: guildId,
      targetId: userId,
      targetType: 'USER',
      createdAt: new Date(),
      extraInfo: JSON.stringify({
        duration: duration,
      }),
    };
    logger.log(
      `Timed out user ${userId} from guild ${guildId} for ${duration}`,
    );
    await member.timeout(duration);
    await this.auditLogService.create(logEntry);
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
    logger.log(`Purging user ${userId} from guild ${guildId}`);
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
