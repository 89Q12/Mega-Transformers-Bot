import { useGlobalApi } from './use-api.tsx';

export type Rank = 'NEW' | 'MEMBER' | 'MOD' | 'ADMIN' | 'OWNER';

export interface User {
  userId: string;
  guildId: string;
  name: string;
  rank: Rank;
  avatarUrl: string;
}

export const useFetchSelf = () => {
  const api = useGlobalApi();

  return (token?: string) => {
    return (
      api
        .auth(`Bearer ${token}`)
        // TODO: replace with actual guild id from GUILD SELECTION PAGE
        .get(`/guild/${import.meta.env.VITE_GUILD_ID}/user/self`)
        .json<User>()
    );
  };
};
