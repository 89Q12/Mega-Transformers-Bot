import { useState, useEffect } from 'react';
import { useGuildId } from '../state/use-guild-id';
import { useApi } from './use-api';

export const useGetMessagesPerDay = () => {
  const api = useApi();
  const guildId = useGuildId();
  const [data, setData] = useState<{
    labels: string[];
    values: number[];
  }>();
  useEffect(() => {
    if (!guildId) return;
    api
      .get(`/guild/${guildId}/messages-per-day-last-month`)
      .json()
      .then((data) => setData(data as { labels: string[]; values: number[] }));
  }, [guildId, api]);

  return data;
};
