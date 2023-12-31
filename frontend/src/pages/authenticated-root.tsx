import { FC } from 'react';
import { Sidebar } from '../components/sidebar';
import { Box } from '@chakra-ui/layout';
import { Outlet } from 'react-router';
import Login from './login';
import { useIsAuthenticated } from '../hooks/state/use-is-authenticated.tsx';

export const AuthenticatedRoot: FC = () => {
  const authenticated = useIsAuthenticated();
  if (!authenticated) {
    return <Login />;
  }
  return (
    <>
      <Sidebar flexGrow={0} flexShrink={0} />
      <Box
        flexGrow={1}
        flexShrink={1}
        height="100%"
        minWidth={0}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Outlet />
      </Box>
    </>
  );
};
