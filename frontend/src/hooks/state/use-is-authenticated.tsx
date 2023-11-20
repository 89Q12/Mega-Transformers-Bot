import { useContext } from 'react';
import { UserContext } from '../../state/user.context.tsx';

export const useIsAuthenticated = () => {
  const { token } = useContext(UserContext);
  return !!token;
};
