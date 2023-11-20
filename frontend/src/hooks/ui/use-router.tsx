import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import Audit from '../../pages/audit';
import Dashboard from '../../pages/dashboard';
import { ErrorHandler } from '../../pages/error-handler.tsx';
import Login from '../../pages/login';
import Moderation from '../../pages/moderation';
import OauthCallback from '../../pages/oauth-callback';
import { Root } from '../../pages/root.tsx';
import Settings from '../../pages/settings';
import { useIsAuthenticated } from '../state/use-is-authenticated.tsx';

export const useRouter = () => {
  const isAuthenticated = useIsAuthenticated();
  return createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorHandler />,
      children: isAuthenticated
        ? createAuthenticatedRoutes()
        : createUnauthenticatedRoutes(),
    },
  ]);
};

const createAuthenticatedRoutes = (): RouteObject[] => [
  {
    path: '/audit',
    element: <Audit />,
  },
  {
    path: '/moderation',
    element: <Moderation />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/oauth-callback',
    element: <Navigate to="/" />,
  },
];

const createUnauthenticatedRoutes = (): RouteObject[] => [
  {
    path: '/oauth-callback',
    element: <OauthCallback />,
  },
  {
    path: '/',
    element: <Login />,
  },
];
