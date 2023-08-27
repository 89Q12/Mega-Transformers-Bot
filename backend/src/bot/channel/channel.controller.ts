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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Client,
  GuildChannel,
  GuildChannelEditOptions,
  GuildBasedChannel,
} from 'discord.js';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';

@Controller('channel')
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
    type: [GuildChannel],
    isArray: true,
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
}
