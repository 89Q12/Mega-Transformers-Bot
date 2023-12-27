import { useGuildApi } from './use-api.tsx';

export type Rank = 'NEW' | 'MEMBER' | 'MOD' | 'ADMIN' | 'OWNER';

export interface GuildSelf {
  userId: string;
  guildId: string;
  name: string;
  rank: Rank;
  avatarUrl: string;
}

export const useFetchGuildSelf = () => {
  const api = useGuildApi();

  return (token?: string) => {
    return api.auth(`Bearer ${token}`).get(`/user/self`).json<GuildSelf>();
  };
};
