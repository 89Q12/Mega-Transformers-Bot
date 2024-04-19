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
  name: 'enter-lockdown',
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
        members.forEach(async (member) => {
          if (
            member.roles.cache.has('1011563978956226560') ||
            member.roles.cache.has('1011513775054143632') ||
            guild.ownerId == member.id
          )
            return;
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
          if (!member.roles.cache.has('1226585753253843014')) {
            await member.roles.add('1121823930085285938');
          }else {
            //await member.roles.add('')
          }
        }),
      ),
    );
  }
}
