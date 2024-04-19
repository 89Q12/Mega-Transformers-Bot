import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Inject, ValidationPipe } from '@nestjs/common';
import { AddRoleDto } from '../dto/add-role.dto';
import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Command({
  name: 'lift-lockdown',
  description: 'Add a role to all members(Excluding team member)',
  defaultMemberPermissions: ['ModerateMembers'],
  dmPermission: false,
})
export class AddRoleCommand {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(PrismaService) private database: PrismaService,
  ) {}
  @Handler()
  async onRoleAdd(@InteractionEvent() interaction: CommandInteraction) {
    interaction.guild.members.fetch().then((members) =>
      members.forEach(async (member) => {
        if (member.roles.cache.has('1121823930085285938')) {
          const roles = (
            await this.database.lockdownRoleBackup.findUnique({
              where: {
                guildId_userId: { guildId: member.guild.id, userId: member.id },
              },
            })
          ).roles as Prisma.JsonArray;
          let error = false;
          roles.forEach((role: { id: string }) => {
            try {
              member.roles.add(role.id);
            } catch {
              error = true;
            }
          });
          if (!error)
            this.database.lockdownRoleBackup.delete({
              where: {
                guildId_userId: {
                  guildId: member.guild.id,
                  userId: member.id,
                },
              },
            });
        }
      }),
    );
  }
}
