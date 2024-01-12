import { useGuildApi } from './use-api.tsx';
import { useCallback } from 'react';

export type Rank = 'NEW' | 'MEMBER' | 'MOD' | 'ADMIN' | 'OWNER';

export interface GuildSelf {
  userId: string;
  guildId: string;
  guildName: string;
  name: string;
  rank: Rank;
  avatarUrl: string;
}

export const useFetchGuildSelf = () => {
  const api = useGuildApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => api.get(`/user/self`).json<GuildSelf>(), []);
};
