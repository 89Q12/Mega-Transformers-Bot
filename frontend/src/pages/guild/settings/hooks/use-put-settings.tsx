import { useGuildApi } from '../../../../hooks/api/use-api.tsx';
import { Settings } from '../domain/settings.tsx';

export const usePutSettings = () => {
  const api = useGuildApi();
  return (settings: Settings) => api.put(settings, `/settings`).text();
};
