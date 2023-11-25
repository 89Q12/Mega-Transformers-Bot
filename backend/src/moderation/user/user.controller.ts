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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
import cleanTextChannel from 'src/util/functions/channel-utils';
import { SendDirectMessageToUserException } from 'src/util/exception/send-direct-message-to-user-exception';
@Controller('discord/user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  logger = new Logger(UserController.name);
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
    this.logger.log(`Found ${members.size} members in guild ${guildId}`);
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
    this.logger.log(`Found member ${member.user.username} in guild ${guildId}`);
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
    this.logger.log(`Banned user ${userId} from guild ${guildId}`);
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
    this.logger.log(`Kicked user ${userId} from guild ${guildId}`);
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

  @Post(':guildId/user/:userId/timeout/:duration')
  @ApiOperation({ summary: 'Timeout a user from a guild' })
  @ApiResponse({
    status: 200,
    description: 'User was successfully timed outed',
  })
  async timeoutUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
    @Param('duration') duration: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    const logEntry: LogEntry = {
      action: 'TIMEOUT',
      invokerId: '688719911320551426',
      reason: 'Timeout',
      guildId: guildId,
      targetId: userId,
      targetType: 'USER',
      createdAt: new Date(),
      extraInfo: JSON.stringify({
        duration: duration,
      }),
    };
    await member.timeout(parseInt(duration));
    await member
      .send(
        `Du hast einen Timeout bis ${new Date(
          new Date().getTime() + duration,
        ).toISOString()}, bei Fragen wende dich an die Mods.`,
      )
      .catch(() => {
        throw new SendDirectMessageToUserException(guildId, userId);
      });
    await this.auditLogService.create(logEntry);
    this.logger.log(
      `Timed out user ${userId} from guild ${guildId} for ${duration}`,
    );
  }

  @Post(':guildId/user/:userId/purge')
  @ApiOperation({
    summary: 'Purge a user from a guild VERY EXPENSIVEEEEEE, USE WITH CAUTION',
  })
  @ApiResponse({
    status: 200,
    description: 'User was successfully purged',
  })
  async purgeUserFromGuild(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    this.logger.log(`Purging user ${userId} from guild ${guildId}`);
    if (guild === undefined) {
      throw new NotFoundException('Guild not found');
    }
    guild.channels.fetch();
    guild.channels.cache.forEach(async (channel) => {
      if (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.PublicThread ||
        channel.type === ChannelType.PrivateThread
      ) {
        this.logger.log(`Purging user ${userId} from channel ${channel.id}`);
        cleanTextChannel(
          channel,
          () => true,
          (msg) => msg.author.id === userId,
        );
        // sleep for 500ms to avoid rate limit
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    });
  }
}
