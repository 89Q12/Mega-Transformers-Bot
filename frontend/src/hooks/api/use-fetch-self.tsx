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
    return (
      api
        .auth(`Bearer ${token}`)
        // TODO: replace with actual guild id from GUILD SELECTION PAGE
        .get('/guild/1011511871297302608/user/self')
        .json<User>()
    );
  };
};
