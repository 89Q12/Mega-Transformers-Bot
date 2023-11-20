import { useSelf } from './use-self.tsx';

export const useGuildId = () => {
  const self = useSelf();
  return self?.guildId;
};
