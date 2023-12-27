import { useGuildApi } from '../../../hooks/api/use-api.tsx';
import { Settings } from '../domain/settings.tsx';
import { useEffect, useState } from 'react';

export const useGetSettings = () => {
  const api = useGuildApi();
  const [settings, setSettings] = useState<Settings>();
  useEffect(() => {
    api
      .get(`/settings`)
      .json<Settings>()
      .then((settings) => setSettings(settings));
  }, [api]);
  return settings;
};
