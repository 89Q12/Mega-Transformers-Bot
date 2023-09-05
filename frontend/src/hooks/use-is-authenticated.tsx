import { useContext } from 'react';
import { UserContext } from '../state/user.context';

export const useIsAuthenticted = () => {
  const { token } = useContext(UserContext);
  return !!token;
};
