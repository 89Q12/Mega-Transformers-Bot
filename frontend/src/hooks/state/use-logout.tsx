import { useContext } from 'react';
import { SelfContext } from '../../state/self.context.tsx';

export const useLogout = () => {
  const { clear } = useContext(SelfContext);
  return () => clear();
};
