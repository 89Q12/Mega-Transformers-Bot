import { useContext } from 'react';
import { UserContext } from '../../state/user.context.tsx';

export const useLogout = () => {
  const { clear } = useContext(UserContext);
  return () => clear();
};
