import { FC, PropsWithChildren, createContext, useState } from 'react';
import Cookies from 'js-cookie';

interface UserContextType {
  token: string | undefined;
  setToken: (token: string) => void;
  clear: () => void;
}

export const UserContext = createContext<UserContextType>(null!);

export const ProvideUserContext: FC<PropsWithChildren> = ({ children }) => {
  const key = 'cardinalAuthToken';
  const [token, setToken] = useState<string | undefined>(
    Cookies.get(key) ?? undefined,
  );

  return (
    <UserContext.Provider
      value={{
        token,
        setToken: (token) => {
          Cookies.set(key, token);
          setToken(token);
        },
        clear: () => {
          Cookies.remove(key);
          setToken(undefined);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
