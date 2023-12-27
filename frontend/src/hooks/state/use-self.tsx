import { useContext } from 'react';
import { SelfContext } from '../../state/self.context.tsx';

export const useSelf = () => {
  const { user } = useContext(SelfContext);
  return user;
};
