import { useState, useEffect } from 'react';
import { useGuildId } from '../state/use-guild-id';
import { useGuildApi } from './use-api';

export const useGetMessagesPerDay = () => {
  const api = useGuildApi();
  const guildId = useGuildId();
  const [data, setData] = useState<{
    labels: string[];
    values: number[];
  }>();
  useEffect(() => {
    api
      .get(`/messages-per-day-last-month`)
      .json()
      .then((data) => setData(data as { labels: string[]; values: number[] }));
  }, [guildId, api]);

  return data;
};
