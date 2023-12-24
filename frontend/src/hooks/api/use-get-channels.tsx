import { useGuildApi } from './use-api.tsx';
import { useEffect, useState } from 'react';
import { APIGuildChannel, ChannelType } from '../../discord-api.ts';

export type Channel = APIGuildChannel<ChannelType>;
export const useGetChannels = () => {
  const api = useGuildApi();
  const [channels, setChannels] = useState<Channel[]>();
  useEffect(() => {
    api
      .get(`/moderation/channel`)
      .json<Channel[]>()
      .then((channels) => setChannels(channels));
  }, [api]);

  return channels;
};
