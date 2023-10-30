import { useContext } from 'react';
import { UserContext } from '../state/user.context';

export const useIsAuthenticated = () => {
  const { token } = useContext(UserContext);
  return !!token;
};
