import {
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChannelType, Client, GuildMember, User } from 'discord.js';
import {
  DiscordUser,
  userResponseSchema,
  usersResponseSchema,
} from '../dto/user';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import cleanTextChannel from 'src/util/functions/channel-utils';
import { SendDirectMessageToUserException } from 'src/util/exception/send-direct-message-to-user-exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserBanEvent,
  UserKickEvent,
  UserPurgeEvent,
  UserTimeOutEvent,
} from '../events/user.events';
import { DiscordGuildMember } from '../dto/guild-member';
import { plainToInstance } from '../../../util/functions/plain-to-instance';

@Controller('/user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  logger = new Logger(UserController.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users for a guild' })
  @ApiResponse({
    status: 200,
    schema: usersResponseSchema,
    type: DiscordGuildMember,
    description: 'Users were successfully fetched',
  })
  async getGuildUsers(
    @Param('guildId') guildId: string,
  ): Promise<DiscordGuildMember[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    this.logger.debug(`Found ${members.size} members in guild ${guildId}`);
    return members.map((member) =>
      plainToInstance(DiscordGuildMember, {
        avatarUrl: member.displayAvatarURL(),
        guildId: member.guild.id,
        bot: member.user.bot,
        userId: member.user.id,
        communicationDisabledUntil:
          member?.communicationDisabledUntil?.toJSON() ?? undefined,
        displayName: member.displayName ?? member.user.globalName,
        username: member.user.username,
      }),
    );
  }

  @Get(':userId')
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

  @Post(':userId/ban')
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
    this.logger.log(`Banned user ${userId} from guild ${guildId}`);
    await this.eventEmitter.emitAsync(
      'user.ban',
      new UserBanEvent(userId, guildId, 'TODO: NOT IMPLEMENTED'),
    );
  }

  @Post(':userId/kick')
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
    this.logger.log(`Kicked user ${userId} from guild ${guildId}`);
    await this.eventEmitter.emitAsync(
      'user.kick',
      new UserKickEvent(userId, guildId, 'TODO: NOT IMPLEMENTED'),
    );
  }

  @Post(':userId/timeout/:duration')
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
    await this.eventEmitter.emitAsync(
      'user.timeout.created',
      new UserTimeOutEvent(
        userId,
        guildId,
        'TODO: NOT IMPLEMENTED',
        new Date(new Date().getTime() + duration).getMilliseconds(),
      ),
    );
    this.logger.log(
      `Timed out user ${userId} from guild ${guildId} for ${duration}`,
    );
  }

  @Post(':userId/purge')
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
    await this.eventEmitter.emitAsync(
      'user.purge',
      new UserPurgeEvent(userId, guildId, 'TODO: NOT IMPLEMENTED'),
    );
  }
}
