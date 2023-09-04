import { RouteObject, createBrowserRouter } from 'react-router-dom';
import Audit from '../pages/audit';
import Dashboard from '../pages/dashboard';
import { ErrorHandler } from '../pages/error-handler';
import Login from '../pages/login';
import OauthCallback from '../pages/oauth-callback';
import { Root } from '../pages/root';
import Settings from '../pages/settings';
import { useIsAuthenticted } from './use-is-authenticated';

export const useRouter = () => {
  const isAuthenticated = useIsAuthenticted();
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
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },
  // {
  // path: '/oauth-callback',

  // },
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
