import { InjectDiscordClient } from '@discord-nestjs/core';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Client,
  GuildChannel,
  GuildChannelEditOptions,
  GuildBasedChannel,
  ChannelType,
  GuildTextBasedChannel,
  Message,
  Collection,
} from 'discord.js';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { Channel } from '../../entities/channel';

@ApiTags('discord/channel')
@Controller('discord/channel')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChannelController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Get('guild/:guildId/channel')
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

  @Post('guild/:guildId/channel/:channelId/clean')
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
    console.log('before unix timestamp: ' + before);
    const guild = await this.client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    switch (channel.type) {
      case ChannelType.GuildText:
        this.cleanTextChannel(channel as GuildTextBasedChannel, userId, before);
        break;
      case ChannelType.PublicThread:
        this.cleanTextChannel(channel as GuildTextBasedChannel, userId, before);
      case ChannelType.PrivateThread:
      case ChannelType.GuildForum:
    }
  }
  private async cleanTextChannel(
    channel: GuildTextBasedChannel,
    userId: string,
    before: number,
  ): Promise<void> {
    let stop = false;
    while (!stop) {
      const messages = await channel.messages.fetch({
        limit: 100,
      });
      if (messages.last().createdTimestamp < before) stop = true;
      messages
        .filter(
          (msg) =>
            msg.author.id === userId &&
            msg.deletable &&
            msg.createdTimestamp > before,
        )
        .forEach((msg) => msg.delete().catch((err) => console.error(err)));
    }
  }
}
