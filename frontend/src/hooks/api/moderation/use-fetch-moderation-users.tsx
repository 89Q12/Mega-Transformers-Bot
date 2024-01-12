import { useGuildApi } from '../use-api.tsx';
import { useEffect, useMemo, useState } from 'react';

export interface DiscordGuildMember {
  userId: string;
  guildId: string;
  communicationDisabledUntil?: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  bot: boolean;
}

export const useFetchModerationUsers = () => {
  const [users, setUsers] = useState<DiscordGuildMember[]>();
  const [refreshing, setRefreshing] = useState(0);
  const api = useGuildApi();

  useEffect(() => {
    setRefreshing((it) => it + 1);
    api
      .get('/moderation/user')
      .json<DiscordGuildMember[]>()
      .then((users) => setUsers(users))
      .finally(() => setRefreshing((it) => it - 1));
  }, [api]);

  const isRefreshing = useMemo(
    () => refreshing > 0 && !!users,
    [refreshing, users],
  );
  return { isRefreshing, users };
};
