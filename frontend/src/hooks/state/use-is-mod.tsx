import { useContext } from 'react';
import { GuildSelfContext } from '../../state/guild-self.context.tsx';

export const useIsMod = () => {
  const { self } = useContext(GuildSelfContext);
  if (!self) return false;
  return self.rank === 'MOD' || self.rank === 'ADMIN' || self.rank === 'OWNER';
};
