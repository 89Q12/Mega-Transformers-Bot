import {
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GuildAutoDeleteChannelService } from './guild-auto-delete-channel.service';
import { GuildAutoDeleteChannelDto } from './dto/auto-delete-channels.dto';
import { plainToInstance } from 'class-transformer';

@Controller('autodeletechannel')
export class GuildAutoDeleteChannelController {
  constructor(
    @Inject(GuildAutoDeleteChannelService)
    private readonly guildAutoDeleteChannelService: GuildAutoDeleteChannelService,
  ) {}

  @Get()
  async getAutoDeleteChannel(@Param('guildId') guildId: string) {
    const autoDeleteChannels =
      await this.guildAutoDeleteChannelService.get(guildId);
    if (!autoDeleteChannels) {
      throw new NotFoundException();
    }
    return plainToInstance(GuildAutoDeleteChannelDto, autoDeleteChannels);
  }

  @Post()
  async createAutoDeleteChannel(
    @Param('guildId') guildId: string,
    @Body() autoDeleteChannel: GuildAutoDeleteChannelDto,
  ) {
    this.guildAutoDeleteChannelService.get(guildId).then(() => {
      throw new ConflictException(
        `Channel ${channel.channelId} already exists`,
      );
    });
    const channel = await this.guildAutoDeleteChannelService.upsert(
      guildId,
      autoDeleteChannel,
    );
    if (!channel) {
      throw new NotFoundException();
    }
    return plainToInstance(GuildAutoDeleteChannelDto, channel);
  }

  @Put()
  async updateAutoDeleteChannel(
    @Param('guildId') guildId: string,
    @Body() autoDeleteChannel: GuildAutoDeleteChannelDto,
  ) {
    const channel = await this.guildAutoDeleteChannelService.upsert(
      guildId,
      autoDeleteChannel,
    );
    if (!channel) {
      throw new NotFoundException();
    }
    return plainToInstance(GuildAutoDeleteChannelDto, channel);
  }
}
