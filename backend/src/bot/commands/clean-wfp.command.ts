import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  userMention,
} from 'discord.js';
import { GuildService } from 'src/guild/guild.service';

@Command({
  name: 'clean-wfp',
  description:
    'Kick all members with the role `wfp` if they are longer than 2 weeks on the server.',
  defaultMemberPermissions: ['ModerateMembers', 'KickMembers'],
  dmPermission: false,
})
export class CleanWfpMember {
  constructor(@Inject(GuildService) private guildService: GuildService) {}
  @Handler()
  async onCleanWfpMembers(@InteractionEvent() interaction: CommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const outCome = await this.guildService.cleanWfpMembers(
      interaction.guildId,
      false,
    );
    const embed = new EmbedBuilder()
      .setTitle('wfp kick member report :3')
      .setColor(Colors.Blue)
      .setDescription(
        'Member die kicked wurden bzw. nicht kicked werden konnten',
      )
      .addFields([
        {
          name: 'Kicked members count',
          value: outCome['membersToKick'].length.toString(),
        },
        {
          name: 'Kicked members names',
          value: outCome['membersToKick']
            .map((member) => userMention(member.id))
            .join('\n'),
        },
        {
          name: "Couldn't kick members count",
          value: outCome['unkickableMembers'].length.toString(),
        },
        {
          name: "Couldn't kick members names",
          value: outCome['unkickableMembers']
            .map((member) => userMention(member.id))
            .join('\n'),
        },
      ]);
    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });
  }
}
