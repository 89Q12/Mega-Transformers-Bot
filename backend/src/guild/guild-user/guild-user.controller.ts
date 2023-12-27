import { InjectDiscordClient } from '@discord-nestjs/core';
import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Client } from 'discord.js';
import { SelfDto } from 'src/guild/guild-user/dto/self.dto';
import { RequestUser } from 'src/util/decorators/request-user.decorator';
import { GuildUserService } from './guild-user.service';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class GuildUserController {
  constructor(
    @Inject(GuildUserService) private readonly userService: GuildUserService,
    @InjectDiscordClient() private readonly client: Client,
  ) {}

  @Get('self')
  async getSelf(
    @RequestUser() userId: string,
    @Param('guildId') guildId: string,
  ): Promise<SelfDto> {
    const [{ rank }, { avatarUrl, name }] = await Promise.all([
      this.userService.getGuildUser(userId, guildId),
      this.client.guilds
        .fetch(guildId)
        .then((it) => it.members.fetch(userId))
        .then((it) => ({
          avatarUrl: it.avatarURL({ size: 128 }),
          name: it.displayName,
        })),
    ]);
    return plainToInstance(SelfDto, {
      userId,
      guildId,
      avatarUrl,
      name,
      rank,
    });
  }
}
