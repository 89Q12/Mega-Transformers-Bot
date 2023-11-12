import { useApi } from '../../../hooks/use-api.tsx';
import { Settings } from '../domain/settings.tsx';
import { useEffect, useState } from 'react';
import { useGuildId } from '../../../hooks/use-guild-id.tsx';

export const useGetSettings = () => {
  const api = useApi();
  const guildId = useGuildId();
  const [settings, setSettings] = useState<Settings>();
  useEffect(() => {
    if (!guildId) return;
    api
      .get(`/settings/${guildId}`)
      .json<Settings>()
      .then((settings) => setSettings(settings));
  }, [api, guildId]);
  return settings;
};
