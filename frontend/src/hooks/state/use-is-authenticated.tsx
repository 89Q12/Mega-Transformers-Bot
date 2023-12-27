import { useContext } from 'react';
import { SelfContext } from '../../state/self.context.tsx';

export const useIsAuthenticated = () => {
  const { token } = useContext(SelfContext);
  return !!token;
};
