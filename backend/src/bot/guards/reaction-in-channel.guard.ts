import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { Message } from 'discord.js';

export const ReactionChannelIdGuard = (channelId: string) => {
  class ChannelIdGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const reaction = context.getArgByIndex(0);
      if (reaction.partial) await reaction.fetch();
      const message = reaction.message;
      if (
        message.message instanceof Message &&
        !(message.message as Message).inGuild()
      ) {
        return false;
      }
      return message.channelId === channelId;
    }
  }

  const guard = mixin(ChannelIdGuardMixin);
  return guard;
};
