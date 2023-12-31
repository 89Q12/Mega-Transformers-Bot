import { GuildSelf } from '../hooks/api/use-fetch-guild-self.tsx';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';

interface GuildSelfContextType {
  self: GuildSelf | undefined;
  set: (self: GuildSelf) => void;
  clear: () => void;
}

export const GuildSelfContext = createContext<GuildSelfContextType>(null!);

export const ProvideGuildSelfContext: FC<PropsWithChildren> = ({
  children,
}) => {
  const [self, setSelf] = useState<GuildSelf | undefined>();
  const clear = useCallback(() => {
    setSelf(undefined);
  }, [setSelf]);
  return (
    <GuildSelfContext.Provider
      value={{
        self,
        set: setSelf,
        clear,
      }}
    >
      {children}
    </GuildSelfContext.Provider>
  );
};
