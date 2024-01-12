import { useCallback } from 'react';
import { useGuildApi } from '../use-api.tsx';
import { DiscordGuildMember } from './use-fetch-moderation-users.tsx';

export const useTimeoutUser = () => {
  const api = useGuildApi();
  return useCallback(
    ({
      userId,
      duration,
    }: {
      userId: DiscordGuildMember['userId'];
      duration: number;
    }) =>
      api
        .post(undefined, `/moderation/user/${userId}/timeout/${duration}`)
        .res()
        .then(() => {}),
    [api],
  );
};
