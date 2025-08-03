import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import { ChannelType, Client, CommandInteraction, Message } from 'discord.js';
import { TargetUser } from '../dto/user.dto';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Logger, NotFoundException, ValidationPipe } from '@nestjs/common';
import cleanTextChannel from 'src/util/functions/channel-utils';

@Command({
  name: 'purguser',
  description: 'Delete all messages of the user',
  defaultMemberPermissions: ['Administrator'],
  dmPermission: false,
})
export class PurgeCommand {
  logger = new Logger(PurgeCommand.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  @Handler()
  async onPlayCommand(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe)
    dto: TargetUser,
  ): Promise<Message<boolean>> {
    await interaction.deferReply();
    const userId = (await interaction.guild.members.fetch(dto.user)).id;
    const guild = await this.client.guilds.fetch(interaction.guildId);
    this.logger.log(`Purging user ${userId} from guild ${interaction.guildId}`);
    if (guild === undefined) {
      throw new NotFoundException('Guild not found');
    }
    guild.channels.fetch();
    guild.channels.cache.forEach(async (channel) => {
      try {
        if (
          channel.type === ChannelType.GuildText ||
          channel.type === ChannelType.PublicThread ||
          channel.type === ChannelType.PrivateThread
        ) {
          this.logger.log(`Purging user ${userId} from channel ${channel.id}`);
          await cleanTextChannel(
            channel,
            () => false,
            (msg) => msg.author.id === userId,
            this.logger,
          );
          // sleep for 500ms to avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch {
        this.logger.error(
          `Failed to purge user ${userId} from channel ${channel.id}`,
        );
      }
    });
    return interaction.followUp(`Purged user user ${userId}`);
  }
}
