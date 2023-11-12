import { useApi } from '../../../hooks/use-api.tsx';
import { useGuildId } from '../../../hooks/use-guild-id.tsx';
import { Settings } from '../domain/settings.tsx';

export const usePutSettings = () => {
  const api = useApi();
  const guildId = useGuildId();
  return (settings: Settings) =>
    api.put(settings, `/settings/${guildId}`).text();
};
