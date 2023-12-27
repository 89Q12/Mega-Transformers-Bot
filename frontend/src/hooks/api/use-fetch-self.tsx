import { useGlobalApi } from './use-api.tsx';

export interface Guild {
  guildId: string;
  name: string;
  image: string;
}

export interface Self {
  userId: string;
  avatarUrl: string;
  name: string;
  guilds: Guild[];
}

export const useFetchSelf = () => {
  const api = useGlobalApi();

  return (token?: string) => {
    return api.auth(`Bearer ${token}`).get(`/user/self`).json<Self>();
  };
};
