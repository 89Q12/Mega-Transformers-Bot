import {
  Command,
  Handler,
  InjectDiscordClient,
  InteractionEvent,
  IA,
  On,
  EventParams,
} from '@discord-nestjs/core';
import { Inject, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  ClientEvents,
  CommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { CommunityQuestionDto } from '../dto/commmunity-question.dto';
import {
  ModalFieldsTransformPipe,
  SlashCommandPipe,
} from '@discord-nestjs/common';
import { IsModalInteractionGuard } from '../guards/is-modal-interaction.guard';
import { CommunityQuestionFormDto } from '../dto/community-question.form.dto';
import { PrismaService } from 'src/prisma.service';

@Command({
  name: 'question',
  description: 'Ask the community a question',
  defaultMemberPermissions: ['ModerateMembers'],
  dmPermission: false,
})
export class CommunityQuestionCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}
  @Handler()
  async onCommunityQuestion(
    @InteractionEvent() interaction: CommandInteraction,
    @IA(SlashCommandPipe, ValidationPipe) question: CommunityQuestionDto,
  ) {
    const questionId = await this.prismaService.guildQuestion.create({
      data: {
        question: question.description,
        guildId: interaction.guildId,
      },
      select: {
        id: true,
      },
    });
    const button = new ButtonBuilder()
      .setCustomId(`community-question-${questionId.id}`)
      .setLabel('Antwort geben')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    interaction.reply({
      components: [row],
      content: question.question,
    });
  }
  @On('interactionCreate')
  async onButtonPress(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.includes('community-question')) return;
    const questionId = interaction.customId.split('-')[2];
    const question = await this.prismaService.guildQuestion.findUnique({
      where: {
        id: parseInt(questionId),
      },
    });
    if (!question) {
      await interaction.reply({
        content: 'Question not found, please contact the mods',
        ephemeral: true,
      });
      return;
    }
    const modal = new ModalBuilder()
      .setCustomId(`community-question-${questionId}`)
      .setTitle('Community Frage');
    const questionField = new TextInputBuilder()
      .setCustomId('question')
      .setLabel('Frage(Nicht bearbeiten)')
      .setStyle(TextInputStyle.Paragraph)
      .setValue(question.question)
      .setRequired(false);
    const answerInput = new TextInputBuilder()
      .setCustomId('answer')
      .setLabel('Antwort')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Antwort');
    const answerComponentRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        answerInput,
      );
    const questionComponentRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        questionField,
      );

    // Add inputs to the modal
    modal.addComponents(questionComponentRow, answerComponentRow);
    await interaction.showModal(modal);
  }

  @On('interactionCreate')
  @UseGuards(IsModalInteractionGuard)
  async onInteraction(
    @IA(ModalFieldsTransformPipe) { answer }: CommunityQuestionFormDto,
    @EventParams() eventArgs: ClientEvents['interactionCreate'],
  ) {
    const [modal] = eventArgs;
    if (
      !modal.isModalSubmit() ||
      !modal.customId.startsWith('community-question')
    )
      return;
    const questionId = modal.customId.split('-')[2];
    const question = await this.prismaService.guildQuestion.findUnique({
      where: {
        id: parseInt(questionId),
      },
    });
    await this.prismaService.guildQuestion.update({
      where: {
        id: parseInt(questionId),
      },
      data: {
        answers: question.answers + 1,
      },
    });
    if (answer.value != '')
      (
        (await (
          await this.client.guilds.fetch(eventArgs[0].guildId)
        ).channels.fetch('1195024829544411168')) as GuildTextBasedChannel
      ).send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: this.client.user.username,
              iconURL: this.client.user.avatarURL(),
              url: 'https://github.com/89Q12/Mega-Transformers-bot',
            })
            .addFields([
              {
                name: 'Antwort von nutzer:in',
                value: answer.value,
              },
              {
                name: 'Frage',
                value: question.question,
              },
            ]),
        ],
      });
    await modal.reply({ content: 'Antwort abgeschickt', ephemeral: true });
  }
}
