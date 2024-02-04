import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';

import { MessageReaction } from 'discord.js';

export const ReactionEmoteGuard = (emote: string) => {
  class ReactionEmote implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const reaction = context.getArgByIndex(0);
      if (
        reaction instanceof MessageReaction &&
        (reaction as MessageReaction).emoji.name === emote
      ) {
        return true;
      }
      return false;
    }
  }

  const guard = mixin(ReactionEmote);
  return guard;
};
