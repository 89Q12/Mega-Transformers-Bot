import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  userMention,
} from 'discord.js';
import UserTimeOutDto from '../dto/user-timeout.dto';
import { SlashCommandPipe, ValidationPipe } from '@discord-nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserSendDMFailedEvent,
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
    await interaction.deferReply({
      ephemeral: true,
    });
    const error: Array<Error> = [];
    try {
      await user.timeout(date - Date.now(), dto.reason);
    } catch (err) {
      error.push(err);
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
    try {
      if (error.length) throw new Error('Timeout failed, therefore no DM');
      await user.send(
        `Du hast einen Timeout bis ${new Date(
          dto.duration,
        ).toString()}, bei Fragen wende dich an die Mods. 
Grund: ${dto.reason}`,
      );
    } catch (err) {
      error.push(err);
      this.eventEmitter.emit(
        'user.send.failed',
        new UserSendDMFailedEvent(user.id, interaction.guildId, err),
      );
    }
    const embed = new EmbedBuilder()
      .setAuthor({
        name: this.client.user.username,
        iconURL: this.client.user.avatarURL(),
      })
      .setTitle(`Timeout user ${user.user.username}`)
      .setDescription(
        error.length === 0
          ? `Timeouted user ${userMention(user.id)} until ${new Date(
              dto.duration,
            ).toLocaleString()} and sent them a DM.`
          : `Failed to timeout user ${userMention(user.id)} until ${new Date(
              dto.duration,
            ).toLocaleString()}, check below for more information.`,
      );
    if (error.length) {
      embed.addFields(
        error.map((e) => {
          if (!(e instanceof Error)) return;
          return {
            name: e.name,
            value: e.message,
          };
        }),
      );
    }
    await interaction.followUp({
      embeds: [embed],
      ephemeral: true,
    });
    this.eventEmitter.emit(
      'user.timeout.created',
      new UserTimeOutEvent(user.id, interaction.guildId, dto.reason, date),
    );
  }
}
