import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Message } from 'discord.js';

@Injectable()
export class MessageIsDmGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex(0);
    if (
      message instanceof Message &&
      !(message as Message).inGuild() &&
      !message.author.bot
    ) {
      return true;
    }
    return false;
  }
}
