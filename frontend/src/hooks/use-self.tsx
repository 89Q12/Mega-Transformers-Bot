import { useContext } from 'react';
import { UserContext } from '../state/user.context.tsx';

export const useSelf = () => {
  const { user } = useContext(UserContext);
  return user;
};
