import { Command, Handler, InjectDiscordClient } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import {
  ApplicationCommandType,
  Client,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
  userMention,
} from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Command({
  name: 'show-info',
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
      return interaction.reply({
        content: 'User not found in database.',
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
          value: `[Click here](https://discord.com/channels/${
            interaction.guildId
          }/1121822614374060175/${
            guildUser.firstMessageId ||
            (await this.getFirstMessageId(interaction))
          })`,
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
  async getFirstMessageId(interaction: ContextMenuCommandInteraction) {
    const channel = (await this.client.channels.fetch(
      '1121822614374060175',
    )) as GuildTextBasedChannel;
    let stop = false;
    let pointer: string;
    while (!stop) {
      try {
        const messages = await channel.messages.fetch({
          limit: 100,
          before: pointer,
        });
        pointer = messages.last() === undefined ? '0' : messages.last().id;
        stop = messages.size < 100;
        const filterd = messages.filter(
          (msg) => msg.author.id === interaction.targetId,
        );
        if (filterd.size > 0) {
          stop = true;
          this.prismaService.guildUser.update({
            where: {
              guildId_userId: {
                guildId: interaction.guildId,
                userId: interaction.targetId,
              },
            },
            data: {
              firstMessageId: filterd.last().id,
            },
          });
          return filterd.last().id;
        }
      } catch {
        stop = true;
      }
    }
  }
}
