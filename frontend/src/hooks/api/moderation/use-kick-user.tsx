import { useCallback } from 'react';
import { useGuildApi } from '../use-api.tsx';
import { DiscordGuildMember } from './use-fetch-moderation-users.tsx';

export const useKickUser = () => {
  const api = useGuildApi();
  return useCallback(
    ({ userId }: { userId: DiscordGuildMember['userId'] }) =>
      api
        .post(null, `/moderation/user/${userId}/kick`)
        .res()
        .then(() => {}),
    [api],
  );
};
