import { useApi } from '../../../hooks/api/use-api.tsx';
import { useGuildId } from '../../../hooks/state/use-guild-id.tsx';
import { Settings } from '../domain/settings.tsx';

export const usePutSettings = () => {
  const api = useApi();
  const guildId = useGuildId();
  return (settings: Settings) =>
    api.put(settings, `/guild/${guildId}/settings`).text();
};
