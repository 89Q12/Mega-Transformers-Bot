import { Command, Handler, InjectDiscordClient } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import {
  ApplicationCommandType,
  Client,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  userMention,
} from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Command({
  name: 'Show user info',
  defaultMemberPermissions: ['ModerateMembers'],
  type: ApplicationCommandType.User,
})
export class UserInfoUiCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(PrismaService)
    private prismaService: PrismaService,
  ) {}
  @Handler()
  async onShowInfo(interaction: ContextMenuCommandInteraction) {
    if (!interaction.isContextMenuCommand()) return;
    interaction.deferReply({ ephemeral: true });
    const guildUser = await this.prismaService.guildUser.findUnique({
      where: {
        guildId_userId: {
          guildId: interaction.guildId,
          userId: interaction.targetId,
        },
      },
    });
    if (!guildUser) {
      return interaction.followUp({
        content: 'User not found in database.',
        ephemeral: true,
      });
    }
    const firstMessageId = guildUser.firstMessageId;
    if (!firstMessageId) {
      return interaction.followUp({
        content:
          'Cannot find the first message for user in the database. \n Please add it manually, using /set-first-message command.',
        ephemeral: true,
      });
    }
    const numMessages = await this.prismaService.messages.count({
      where: { userId: interaction.targetId, guildId: interaction.guildId },
    });
    const numReactions = await this.prismaService.auditLog.count({
      where: {
        invokerId: interaction.targetId,
        guildId: interaction.guildId,
        action: 'REACTION_ADD',
      },
    });

    const embed = new EmbedBuilder()
      .setTitle('User Info')
      .setDescription(`User: ${userMention(interaction.targetId)}`)
      .addFields([
        {
          name: 'Link to introduction message',
          value: `[Click here](https://discord.com/channels/${interaction.guildId}/1121822614374060175/${firstMessageId})`,
        },
        {
          name: 'Number of messages sent',
          value: numMessages.toString(),
        },
        {
          name: 'Reactions added',
          value: numReactions.toString(),
        },
      ]);
    return interaction.followUp({
      embeds: [embed],
      ephemeral: true,
    });
  }
}
