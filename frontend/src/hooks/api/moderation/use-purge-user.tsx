import { useCallback } from 'react';
import { useGuildApi } from '../use-api.tsx';
import { DiscordGuildMember } from './use-fetch-moderation-users.tsx';

export const usePurgeUser = () => {
  const api = useGuildApi();
  return useCallback(
    ({ userId }: { userId: DiscordGuildMember['userId'] }) =>
      api
        .post(`/moderation/user/${userId}/purge`)
        .res()
        .then(() => {}),
    [api],
  );
};
