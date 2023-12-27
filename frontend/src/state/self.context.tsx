import { createContext, FC, PropsWithChildren, useState } from 'react';
import Cookies from 'js-cookie';
import { Self } from '../hooks/api/use-fetch-self.tsx';

interface SelfContextType {
  token: string | undefined;
  user: Self | undefined;
  set: (token: string, user: Self) => void;
  clear: () => void;
  initializing: boolean;
}

export const SelfContext = createContext<SelfContextType>(null!);

export const ProvideSelfContext: FC<PropsWithChildren> = ({ children }) => {
  const key = 'cardinalAuthToken';
  const [token, setToken] = useState<string | undefined>(
    Cookies.get(key) ?? undefined,
  );
  const [user, setUser] = useState<Self | undefined>();

  return (
    <SelfContext.Provider
      value={{
        token,
        user,
        set: (token, user) => {
          Cookies.set(key, token);
          setToken(token);
          setUser(user);
        },
        clear: () => {
          Cookies.remove(key);
          setToken(undefined);
          setUser(undefined);
        },
        initializing: !!(token && !user),
      }}
    >
      {children}
    </SelfContext.Provider>
  );
};
