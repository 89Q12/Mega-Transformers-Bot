import { Box, VStack } from '@chakra-ui/layout';
import { Outlet } from 'react-router';
import { Header } from '../components/header';

export const Root = () => (
  <VStack height="100%" alignItems="stretch">
    <Header />
    <Box flexGrow={1} padding="3">
      <Outlet />
    </Box>
  </VStack>
);
