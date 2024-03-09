import { Command, Handler, InjectDiscordClient } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import {
  ApplicationCommandType,
  Client,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Message,
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
    await interaction.deferReply({ ephemeral: true });
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
    const message = await this._getMessage(firstMessageId, interaction.guildId);
    const numMessages = await this.prismaService.messages.count({
      where: { userId: interaction.targetId, guildId: interaction.guildId },
    });
    const numReactions = await this.prismaService.auditLog.count({
      where: {
        invokerId: interaction.targetId,
        guildId: interaction.guildId,
        action: 'REACTION_ADDED',
      },
    });

    const embed = new EmbedBuilder()
      .setTitle('User Info')
      .setDescription(`User: ${userMention(interaction.targetId)}`)
      .addFields([
        {
          name: 'Link to introduction message',
          value: message ? `$[Click here](${message.url})` : "No message found in the database",
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
  async _getMessage(msgId: string, guildId: string) {
    if (!msgId) return null;
    let message: Message<true> = null;
    await this.client.guilds.fetch(guildId).then(async (guild) => {
      (await guild.channels.fetch()).forEach(async (channel) => {
        if (channel.isTextBased()) {
          try {
            message = await channel.messages.fetch(msgId);
          } catch {
            return;
          }
        }
      });
    });
    return message;
  }
}
