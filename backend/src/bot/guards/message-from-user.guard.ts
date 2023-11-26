import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Message } from 'discord.js';

export class MessageFromUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex(0);
    if (!(message instanceof Message) && !(message as Message).inGuild) {
      return false;
    }
    return !message.author.bot;
  }
}
