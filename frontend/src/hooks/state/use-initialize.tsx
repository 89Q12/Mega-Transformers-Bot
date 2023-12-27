import { useContext, useEffect } from 'react';
import { SelfContext } from '../../state/self.context.tsx';
import { useFetchSelf } from '../api/use-fetch-self.tsx';

export const useInitialize = () => {
  const { user, token, set } = useContext(SelfContext);
  const fetchSelf = useFetchSelf();
  useEffect(() => {
    if (token && !user) {
      fetchSelf(token).then((self) => set(token, self));
    }
  }, [user, token, fetchSelf, set]);
};
