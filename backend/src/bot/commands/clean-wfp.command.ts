import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import { CommandInteraction, GuildMember } from 'discord.js';
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
    
    const membersToKick = await this.guildService.cleanWfpMembers(interaction.guildId, true);
    await interaction.followUp({
      ephemeral: true,
      content: `About to kick ${membersToKick.length} members!`,
    });
    const unkickableMemberIds = await this.guildService.cleanWfpMembers(interaction.guildId, false);
    await interaction.followUp({
      ephemeral: true,
      content: `Done!, but could not kick ${unkickableMemberIds.length} members`,
    });
  }
}
