import { Box, VStack } from '@chakra-ui/layout';
import { Outlet } from 'react-router';
import { useContext } from 'react';
import { SelfContext } from '../state/self.context.tsx';
import { PageSpinner } from '../components/page-spinner.tsx';
import { useInitialize } from '../hooks/state/use-initialize.tsx';

export const Root = () => {
  const { initializing } = useContext(SelfContext);
  useInitialize();
  return (
    <VStack height="100%" alignItems="stretch">
      {initializing && <PageSpinner />}
      {!initializing && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            width="100%"
          >
            <Outlet />
          </Box>
        </>
      )}
    </VStack>
  );
};
