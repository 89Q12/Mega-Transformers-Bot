import { createContext, FC, PropsWithChildren, useState } from 'react';
import Cookies from 'js-cookie';
import { User } from '../hooks/api/use-fetch-self.tsx';

interface UserContextType {
  token: string | undefined;
  user: User | undefined;
  set: (token: string, user: User) => void;
  clear: () => void;
  initializing: boolean;
}

export const UserContext = createContext<UserContextType>(null!);

export const ProvideUserContext: FC<PropsWithChildren> = ({ children }) => {
  const key = 'cardinalAuthToken';
  const [token, setToken] = useState<string | undefined>(
    Cookies.get(key) ?? undefined,
  );
  const [user, setUser] = useState<User | undefined>();

  return (
    <UserContext.Provider
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
    </UserContext.Provider>
  );
};
