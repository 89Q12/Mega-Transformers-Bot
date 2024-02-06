import { Command, Handler, InjectDiscordClient } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import {
  ApplicationCommandType,
  Client,
  ContextMenuCommandInteraction,
  userMention,
} from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Command({
  name: 'Set first message',
  defaultMemberPermissions: ['ModerateMembers'],
  type: ApplicationCommandType.Message,
})
export class SetFirstMessageUICommand {
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
    const message = await interaction.channel.messages.fetch(
      interaction.targetId,
    );
    await this.prismaService.guildUser.update({
      where: {
        guildId_userId: {
          guildId: message.guildId,
          userId: message.author.id,
        },
      },
      data: {
        firstMessageId: interaction.targetId,
      },
    });
    interaction.followUp({
      content: `First message for ${userMention(
        message.author.id,
      )} has been set.`,
      ephemeral: true,
    });
  }
}
