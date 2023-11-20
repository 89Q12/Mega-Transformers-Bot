import { Box, VStack } from '@chakra-ui/layout';
import { Outlet } from 'react-router';
import { Header } from '../components/header';
import { useContext } from 'react';
import { UserContext } from '../state/user.context.tsx';
import { PageSpinner } from '../components/page-spinner.tsx';
import { useInitialize } from '../hooks/state/use-initialize.tsx';

export const Root = () => {
  const { initializing } = useContext(UserContext);
  useInitialize();
  return (
    <VStack height="100%" alignItems="stretch">
      {initializing && <PageSpinner />}
      {!initializing && (
        <>
          <Header />
          <Box flexGrow={1} padding="3">
            <Outlet />
          </Box>
        </>
      )}
    </VStack>
  );
};
