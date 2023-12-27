import { useState, useEffect } from 'react';
import { useGuildId } from '../state/use-guild-id';
import { useGuildApi } from './use-api';

export const useGetAverageMessagesPerChannelPer30Days = () => {
  const api = useGuildApi();
  const guildId = useGuildId();
  const [data, setData] = useState<{
    labels: string[];
    values: number[];
  }>();
  useEffect(() => {
    api
      .get(`/messages-per-channel-last-month`)
      .json()
      .then((data) => setData(data as { labels: string[]; values: number[] }));
  }, [guildId, api]);

  return data;
};
