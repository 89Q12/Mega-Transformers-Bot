import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MessageReaction, User } from 'discord.js';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';

@Injectable()
export class ReactedMemberIsModOrHigherGuard implements CanActivate {
  constructor(
    @Inject(GuildUserService)
    private readonly settingsService: GuildUserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const message = context.getArgByIndex(0);
    const discordUser: User = context.getArgByIndex(1);
    if (discordUser.partial) await discordUser.fetch();
    if (message.partial) await message.fetch();
    if (!(message instanceof MessageReaction)) return false;
    if (!message.message.inGuild()) {
      return false;
    }
    const user = await this.settingsService.getGuildUser(
      discordUser.id,
      message.message.guildId,
    );
    if (['MOD', 'ADMIN', 'OWNER'].includes(user.rank)) {
      return true;
    }
    return false;
  }
}
