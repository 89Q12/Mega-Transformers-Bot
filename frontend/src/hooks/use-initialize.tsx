import { useContext, useEffect } from 'react';
import { UserContext } from '../state/user.context.tsx';
import { useFetchSelf } from './use-fetch-self.tsx';

export const useInitialize = () => {
  const { user, token, set } = useContext(UserContext);
  const fetchSelf = useFetchSelf();
  useEffect(() => {
    if (token && !user) {
      fetchSelf(token).then((self) => set(token, self));
    }
  }, [user, token, fetchSelf, set]);
};
