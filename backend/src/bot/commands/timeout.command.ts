import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';

import { Client, CommandInteraction } from 'discord.js';
import UserTimeOutDto from '../dto/user-timeout.dto';
import { SlashCommandPipe, ValidationPipe } from '@discord-nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserTimeOutEvent,
  UserTimeOutFailedEvent,
} from 'src/moderation/events/user.events';
import { UseFilters } from '@nestjs/common';
import { CommandValidationFilter } from '../filters/command-validation';

@Command({
  name: 'timeout',
  description: 'Timeouts a user',
  defaultMemberPermissions: ['ModerateMembers'],
  descriptionLocalizations: {
    'en-US': 'Timeouts a user',
    de: 'Nutzer:in muten (Timeout)',
  },
})
export class TimeOutCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  @Handler()
  @UseFilters(CommandValidationFilter)
  async onTimeOutCommand(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe)
    dto: UserTimeOutDto,
  ) {
    const date = new Date(dto.duration).getTime();
    const user = await interaction.guild.members.fetch(dto.user);
    try {
      await user.timeout(date - Date.now(), dto.reason);
      this.eventEmitter.emit(
        'user.timeout.created',
        new UserTimeOutEvent(user.id, interaction.guildId, dto.reason, date),
      );
      interaction.reply({
        content: `Timeouted user ${user.user.username} for ${
          (date - Date.now()) / 1000 / 60 / 60 / 24
        } days`,
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
        content: `Failed to timeout user ${user.user.username} for ${
          (date - Date.now()) / 1000 / 60 / 60 / 24
        } days, reason: ${err.message}`,
        ephemeral: true,
      });
      this.eventEmitter.emit(
        'user.timeout.failed',
        new UserTimeOutFailedEvent(
          user.id,
          interaction.guildId,
          dto.reason,
          date,
          err,
        ),
      );
    }
  }
}
