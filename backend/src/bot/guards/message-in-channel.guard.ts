import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { Message } from 'discord.js';

export const ChannelIdGuard = (channelId: string) => {
  class ChannelIdGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const message = context.getArgByIndex(0);
      if (!(message instanceof Message) || !(message as Message).inGuild()) {
        return false;
      }
      return message.channelId === channelId;
    }
  }

  const guard = mixin(ChannelIdGuardMixin);
  return guard;
};
