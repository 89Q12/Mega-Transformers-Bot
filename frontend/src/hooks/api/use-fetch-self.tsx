import { useApi } from './use-api.tsx';

export type Rank = 'NEW' | 'MEMBER' | 'MOD' | 'ADMIN' | 'OWNER';

export interface User {
  userId: string;
  guildId: string;
  name: string;
  rank: Rank;
  avatarUrl: string;
}

export const useFetchSelf = () => {
  const api = useApi();

  return (token?: string) => {
    return api.auth(`Bearer ${token}`).get('/user/self').json<User>();
  };
};
