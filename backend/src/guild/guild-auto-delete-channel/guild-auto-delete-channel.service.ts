import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, GuildChannel } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { GuildAutoDeleteChannelDto } from './dto/auto-delete-channels.dto';

@Injectable()
export class GuildAutoDeleteChannelService {
  logger = new Logger(GuildAutoDeleteChannelService.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(PrismaService) private database: PrismaService,
    @Inject(TasksService) private tasksService: TasksService,
  ) {}
  async get(guildId: string) {
    return await this.database.autoDeleteChannels.findMany({
      where: { guildId },
    });
  }
  async upsert(guildId: string, autoDeleteChannel: GuildAutoDeleteChannelDto) {
    const channelId = autoDeleteChannel.channelId;
    return this.database.autoDeleteChannels.upsert({
      where: {
        channelId,
        guildId,
      },
      create: {
        ...autoDeleteChannel,
        guildId,
      },
      update: {
        ...autoDeleteChannel,
        guildId,
      },
    });
  }

  async constructChannelDeleteJobs() {
    const guilds = await this.database.guild.findMany({
      select: {
        AutoDeleteChannels: true,
      },
    });
    guilds.forEach((guild) => {
      guild.AutoDeleteChannels.forEach((deleteChannel) => {
        this.tasksService.createDynamicScheduledJob({
          cronTime: deleteChannel.deleteAtCron,
          onTick: async () => {
            const channelId = deleteChannel.channelId;
            const guildId = deleteChannel.guildId;
            this.logger.log(
              `Deleting channel ${channelId} in guild ${guildId}`,
            );
            const guild = await this.client.guilds.fetch(guildId);
            const channel = (await guild.channels.fetch(
              channelId,
            )) as GuildChannel;
            const nChannel = await channel.clone();
            await channel.delete();
            Promise.all([
              nChannel.setPosition(channel.position),
              nChannel.setParent(channel.parentId),
              nChannel.setName(channel.name),
            ]);
          },
          timeZone: 'Europe/Berlin',
        });
      });
    });
  }
}
