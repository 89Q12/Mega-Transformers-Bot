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
      <Sidebar />
      <Box flexGrow={1}>
        <Outlet />
      </Box>
    </>
  );
};
