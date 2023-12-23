import { Inject, Injectable } from '@nestjs/common';
import { Guild } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GuildService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async upsertGuild(guildId: string, data: Omit<Partial<Guild>, 'id'>) {
    return await this.database.guild.upsert({
      where: {
        id: guildId,
      },
      create: {
        id: guildId,
        Settings: {
          create: {},
        },
        ...data,
      },
      update: {
        ...data,
      },
    });
  }
}
