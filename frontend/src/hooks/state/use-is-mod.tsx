import { useContext } from 'react';
import { UserContext } from '../../state/user.context.tsx';

export const useIsMod = () => {
  const { user } = useContext(UserContext);
  if (!user) return false;
  return (
    (user && user.rank === 'MOD') ||
    user.rank === 'ADMIN' ||
    user.rank === 'OWNER'
  );
};
