import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

@Command({
  name: 'clean-wfp',
  description:
    'Kick all members with the role `wfp` if they are longer than 2 weeks on the server.',
  defaultMemberPermissions: ['ModerateMembers', 'KickMembers'],
  dmPermission: false,
})
export class CleanWfpMember {
  @Handler()
  async onCleanWfpMembers(@InteractionEvent() interaction: CommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const members = (await (await interaction.guild.fetch()).roles.fetch('d'))
      .members;
    await interaction.followUp({
      ephemeral: true,
      content: `About to kick ${members.size}`,
    });
    members.forEach(async (member) => {
      // 1209600000 = ((3600 * 24) * 14) * 1000  =14 days in ms
      if (
        member.joinedTimestamp < new Date().getTime() - 1209600000 &&
        member.kickable
      )
        try {
          await member.kick(
            'Kicked by the bot for being in wfp for more than 2 weeks',
          );
        } catch {
          console.log('Error kicking members');
        }
    });
  }
}
