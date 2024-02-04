import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';

import { MessageReaction } from 'discord.js';

export const ReactionEmoteGuard = (emotes: string[]) => {
  class ReactionEmote implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const reaction = context.getArgByIndex(0);
      if (
        reaction instanceof MessageReaction &&
        emotes.includes((reaction as MessageReaction).emoji.name)
      ) {
        return true;
      }
      return false;
    }
  }

  const guard = mixin(ReactionEmote);
  return guard;
};
