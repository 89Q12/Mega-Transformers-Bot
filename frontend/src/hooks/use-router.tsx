import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import Audit from '../pages/audit';
import Dashboard from '../pages/dashboard';
import { ErrorHandler } from '../pages/error-handler';
import Login from '../pages/login';
import Moderation from '../pages/moderation';
import OauthCallback from '../pages/oauth-callback';
import { Root } from '../pages/root';
import Settings from '../pages/settings';
import { useIsAuthenticated } from './use-is-authenticated';

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
