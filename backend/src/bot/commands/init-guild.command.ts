import { Command, Handler, InteractionEvent, On } from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  ChannelType,
  CommandInteraction,
  MessageActionRowComponentBuilder,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
} from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Command({
  name: 'setup-bot',
  description: 'Shows a modal to set/update the bot settings',
  defaultMemberPermissions: ['ModerateMembers'],
  dmPermission: false,
})
export class initGuildCommand {
  constructor(
    @Inject(PrismaService) private readonly prismaServer: PrismaService,
  ) {}
  @Handler()
  async onInitGuild(@InteractionEvent() interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const settings = await this.prismaServer.settings.findUnique({
      where: { guildId: interaction.guildId },
    });
    const setOpenIntroChannelId = new ChannelSelectMenuBuilder()
      .setCustomId('openIntroChannelId-setup')
      .addChannelTypes([
        ChannelType.GuildText,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ])
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.channels.fetch(settings.openIntroChannelId))
          .name ?? 'Select the open intro channel',
      );

    const setIntroChannelId = new ChannelSelectMenuBuilder()
      .setCustomId('IntroChannelId-setup')
      .addChannelTypes([
        ChannelType.GuildText,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ])
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.channels.fetch(settings.introChannelId))
          .name ?? 'Select the intro channel',
      );
    const setMiscChannelId = new ChannelSelectMenuBuilder()
      .setCustomId('miscChannelId-setup')
      .addChannelTypes([
        ChannelType.GuildText,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ])
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.channels.fetch(settings.leaveChannelId))
          .name ?? 'Select the miscellaneous channel',
      );
    const setModChannelId = new ChannelSelectMenuBuilder()
      .setCustomId('modChannelId-setup')
      .addChannelTypes([
        ChannelType.GuildText,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ])
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.channels.fetch(settings.modChannelId)).name ??
          'Select the mod channel',
      );
    const setModRoleId = new RoleSelectMenuBuilder()
      .setCustomId('modRoleId-setup')
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.roles.fetch(settings.modRoleId)).name ??
          'Select the mod role',
      );

    const setAdminRoleId = new RoleSelectMenuBuilder()
      .setCustomId('adminRoleId-setup')
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.roles.fetch(settings.adminRoleId)).name ??
          'Select the admin role',
      );

    const setVerifiedMemberRoleId = new RoleSelectMenuBuilder()
      .setCustomId('verifiedMemberRoleId-setup')
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.roles.fetch(settings.verifiedMemberRoleId))
          .name ?? 'Select the verified member role',
      );

    const setUnverifiedRoleId = new RoleSelectMenuBuilder()
      .setCustomId('unverifiedMemberRoleId-setup')
      .setMaxValues(1)
      .setMinValues(0)
      .setPlaceholder(
        (await interaction.guild.roles.fetch(settings.unverifiedMemberRoleId))
          .name ?? 'Select the unverified member role',
      );

    const roleRows = [
      setAdminRoleId,
      setModRoleId,
      setUnverifiedRoleId,
      setVerifiedMemberRoleId,
    ].map((row) =>
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        row,
      ),
    );
    const channelRows = [
      setModChannelId,
      setIntroChannelId,
      setOpenIntroChannelId,
      setMiscChannelId,
    ].map((row) =>
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        row,
      ),
    );

    Promise.all([
      interaction.followUp({
        ephemeral: true,
        content: 'Configure the role settings below',
        components: [...roleRows],
      }),
      interaction.followUp({
        ephemeral: true,
        content: 'Configure the channel settings below',
        components: [...channelRows],
      }),
    ]);
  }

  @On('interactionCreate')
  async onInteraction(
    interaction: ChannelSelectMenuInteraction | RoleSelectMenuInteraction,
  ) {
    if (
      !(
        interaction.customId != undefined &&
        interaction.customId.endsWith('-setup') &&
        interaction.isAnySelectMenu()
      )
    )
      return;
    await interaction.deferReply({ ephemeral: true });
    if (interaction.isChannelSelectMenu()) {
      const guildId = interaction.guildId;
      const channelId = interaction.values[0];
      switch (interaction.customId) {
        case 'openIntroChannelId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { openIntroChannelId: channelId },
          });
          break;
        case 'IntroChannelId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { introChannelId: channelId },
          });
          break;
        case 'miscChannelId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { leaveChannelId: channelId },
          });
          break;
        case 'modChannelId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { modChannelId: channelId },
          });
          break;
      }
      await interaction.followUp({
        content: 'Done!',
        ephemeral: true,
      });
    } else if (interaction.isRoleSelectMenu()) {
      const guildId = interaction.guildId;
      const roleId = interaction.values[0];
      switch (interaction.customId) {
        case 'modRoleId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { modRoleId: roleId },
          });
          break;
        case 'adminRoleId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { adminRoleId: roleId },
          });
          break;
        case 'verifiedMemberRoleId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { verifiedMemberRoleId: roleId },
          });
          break;
        case 'unverifiedMemberRoleId-setup':
          await this.prismaServer.settings.update({
            where: { guildId: guildId },
            data: { unverifiedMemberRoleId: roleId },
          });
          break;
      }
      await interaction.followUp({
        content: 'Done!',
        ephemeral: true,
      });
    }
  }
}
