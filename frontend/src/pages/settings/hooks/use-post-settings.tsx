import { useApi } from '../../../hooks/use-api.tsx';
import { useGuildId } from '../../../hooks/use-guild-id.tsx';
import { Settings } from '../domain/settings.tsx';

export const usePostSettings = () => {
  const api = useApi();
  const guildId = useGuildId();
  return (settings: Settings) =>
    api.post(settings, `/settings/${guildId}`).text();
};
