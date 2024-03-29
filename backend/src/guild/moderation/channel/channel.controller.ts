import { InjectDiscordClient } from '@discord-nestjs/core';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Client,
  GuildChannel,
  GuildChannelEditOptions,
  GuildBasedChannel,
  ChannelType,
  GuildTextBasedChannel,
} from 'discord.js';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { Channel } from '../dto/channel';
import cleanTextChannel from 'src/util/functions/channel-utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ChannelCleaned,
  SlowmodeDisabled,
  SlowmodeEnabled,
} from '../events/channel.event';
import { ChannelNotTextBasedException } from 'src/util/exception/channel-not-text-based-exception';
import { HasRequiredRank } from 'src/util/guards/has-required-rank.guard';
import { RequiredRank } from 'src/util/decorators/requires-rank.decorator';
import { Rank } from '@prisma/client';

@ApiTags('/channel')
@Controller('/channel')
@RequiredRank(Rank.MOD)
@UseGuards(JwtAuthGuard, HasRequiredRank)
export class ChannelController {
  logger = new Logger(ChannelController.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all channels for a guild' })
  @ApiResponse({
    status: 200,
    type: [Channel],
    description: 'Channels were successfully fetched',
  })
  async getGuildChannels(
    @Param('guildId') guildId: string,
  ): Promise<GuildChannel[]> {
    const guild = await this.client.guilds.fetch(guildId);
    this.logger.log(
      `Found ${guild.channels.cache.size} channels in guild ${guildId}`,
    );
    return (await guild.channels.fetch()).toJSON();
  }

  @Get(':channelId')
  @ApiOperation({ summary: 'Get a channel for a guild' })
  @ApiResponse({
    status: 200,
    type: Channel,
    description: 'Channel was successfully fetched',
  })
  async getGuildChannel(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
  ): Promise<GuildBasedChannel> {
    const guild = await this.client.guilds.fetch(guildId);
    this.logger.log(
      `Found ${guild.channels.cache.size} channels in guild ${guildId}`,
    );
    return await guild.channels.fetch(channelId);
  }

  @Put(':channelId')
  @ApiOperation({ summary: 'Edit a channel for a guild' })
  async editChannel(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() channelData: GuildChannelEditOptions,
  ): Promise<GuildBasedChannel> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    await channel.edit(channelData);
    this.logger.log(`Edited channel ${channelId} in guild ${guildId}`);
    return channel;
  }

  @Post(':channelId/slowmode')
  @ApiOperation({ summary: 'Set slowmode for a channel' })
  async setSlowmode(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() { duration }: { duration: number },
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId) as GuildChannel;
    this.logger.log(
      `Set slowmode for channel ${channelId} in guild ${guildId}`,
    );
    await this.eventEmitter.emitAsync(
      `channel.slowmode.${duration > 0 ? 'enabled' : 'disabled'}`,
      duration > 0
        ? new SlowmodeEnabled(guildId, channelId, true, duration)
        : new SlowmodeDisabled(guildId, channelId, false),
    );
    await channel.edit({ rateLimitPerUser: duration });
  }

  @Post(':channelId/clean')
  @ApiOperation({ summary: 'Clean a channel' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        before: {
          type: 'number',
        },
      },
    },
  })
  async cleanChannel(
    @Param('guildId') guildId: string,
    @Param('channelId') channelId: string,
    @Body() { userId, before }: { userId: string; before: number },
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    this.logger.log(
      `Cleaning channel ${channelId} in guild ${guildId} from messages before ${before} of user ${userId}`,
    );
    if (
      channel.type in
      [
        ChannelType.GuildText,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ]
    ) {
      cleanTextChannel(
        channel as GuildTextBasedChannel,
        (messages) => messages.last().createdTimestamp < before,
        (msg) => msg.deletable && msg.createdTimestamp > before,
        this.logger,
      );
    } else {
      throw new ChannelNotTextBasedException(channel.name);
    }
    await this.eventEmitter.emitAsync(
      'channel.clean',
      new ChannelCleaned(guildId, channelId, 0, before, userId),
    );
  }
}
