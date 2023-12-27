import { useContext } from 'react';
import { SelfContext } from '../../state/self.context.tsx';

export const useIsMod = () => {
  const { user } = useContext(SelfContext);
  if (!user) return false;
  return (
    (user && user.rank === 'MOD') ||
    user.rank === 'ADMIN' ||
    user.rank === 'OWNER'
  );
};
