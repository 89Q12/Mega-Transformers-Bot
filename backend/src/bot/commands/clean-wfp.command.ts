import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { CommandInteraction, GuildMember } from 'discord.js';

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
    const twoWeekDate = new Date(new Date().setDate(new Date().getDate() - 15));
    const membersUnfiltered = (
      await (await interaction.guild.fetch()).roles.fetch('1121823930085285938')
    ).members;
    let members: Array<GuildMember> = [];
    membersUnfiltered.forEach(async (member) => {
      if (
        twoWeekDate > new Date(member.joinedTimestamp) &&
        // Has not VereinsMitglied
        !member.roles.cache.has('1070116538083975309')
      ) {
        members.push(member);
      }
    });
    await interaction.followUp({
      ephemeral: true,
      content: `About to kick ${members.length}/`,
    });
    let unkickableMemberIds: Array<string> = [];
    members.forEach(async (member) => {
      try {
        await member.kick(
          'Kicked by the bot for being in wfp for more than 2 weeks',
        );
      } catch {
        unkickableMemberIds.push(member.id);
      }
    });
    await interaction.followUp({
      ephemeral: true,
      content: `Done!, but could not kick ${unkickableMemberIds.length} members`,
    });
  }
}
