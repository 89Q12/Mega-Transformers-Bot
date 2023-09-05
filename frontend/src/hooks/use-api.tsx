import { useContext } from 'react';
import wretch from 'wretch';
import { UserContext } from '../state/user.context';

const instance = wretch(import.meta.env.VITE_API_URL);

export const useApi = () => {
  const { token } = useContext(UserContext);
  if (!token) return instance;
  return instance.auth(`Bearer ${token}`);
};
