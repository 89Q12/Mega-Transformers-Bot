import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
} from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Client, CommandInteraction } from 'discord.js';
import { PrismaService } from 'src/prisma.service';

@Command({
  name: 'activate-agb',
  dmPermission: false,
})
export class UnverifyByRoleCommand {
  constructor(
    @InjectDiscordClient() private client: Client,
    @Inject(PrismaService) private database: PrismaService,
  ) {}
  @Handler()
  onUnverifybyRole(@IA() baseInteraction: CommandInteraction) {
    this.client.guilds.fetch(baseInteraction.guildId).then((guild) =>
      guild.members.fetch().then((members) =>
        members.forEach((member) => {
          if (!member.roles.cache.has('1226585753253843014')) {
            const roles = [];
            member.roles.cache.forEach((role) => roles.push({ id: role.id }));
            this.database.lockdownRoleBackup
              .create({
                data: {
                  guildId: member.guild.id,
                  userId: member.id,
                  roles,
                },
              })
              .then(async (data) =>
                (data.roles as Prisma.JsonArray).forEach(
                  async (role: { id: string }) =>
                    await member.roles.remove(role.id),
                ),
              );
          }
        }),
      ),
    );
  }
}
