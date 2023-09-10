import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';

export const ChannelIdGuard = (channelId: string) => {
  class ChannelIdGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const message = context.getArgByIndex(0);
      return message.channelId === channelId;
    }
  }

  const guard = mixin(ChannelIdGuardMixin);
  return guard;
};
