import { FC, useContext, useEffect } from 'react';
import {
  GuildSelfContext,
  ProvideGuildSelfContext,
} from '../../state/guild-self.context.tsx';
import { useFetchGuildSelf } from '../../hooks/api/use-fetch-guild-self.tsx';
import { useGuildId } from '../../hooks/state/use-guild-id.tsx';
import { Box } from '@chakra-ui/layout';
import { Outlet } from 'react-router';
import { Header } from '../../components/header.tsx';

const GuildRoot: FC = () => {
  const { set, clear } = useContext(GuildSelfContext);
  const guildId = useGuildId();
  const fetchGuildSelf = useFetchGuildSelf();
  useEffect(() => {
    if (!guildId) {
      clear();
      return;
    }
    fetchGuildSelf().then((it) => set(it));
    return () => clear();
  }, [clear, set, guildId, fetchGuildSelf]);
  return (
    <ProvideGuildSelfContext>
      <Box display="flex" flexDirection="column" height="100%" width="100%">
        <Header flexGrow={0} flexShrink={0} />
        <Box
          flexGrow={1}
          overflowY="auto"
          width="100%"
          overflowX="auto"
          padding={10}
        >
          <Outlet />
        </Box>
      </Box>
    </ProvideGuildSelfContext>
  );
};

export default GuildRoot;
