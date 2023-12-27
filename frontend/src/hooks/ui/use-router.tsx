import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Audit from '../../pages/guild/audit';
import Dashboard from '../../pages/guild/dashboard';
import { ErrorHandler } from '../../pages/error-handler.tsx';
import Moderation from '../../pages/guild/moderation';
import OauthCallback from '../../pages/oauth-callback';
import { Root } from '../../pages/root.tsx';
import Settings from '../../pages/guild/settings';
import SelectGuild from '../../pages/select-guild';
import GuildRoot from '../../pages/guild';
import { AuthenticatedRoot } from '../../pages/authenticated-root.tsx';

export const useRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorHandler />,
      children: createAuthenticatedRoutes(),
    },
  ]);
};

const createAuthenticatedRoutes = (): RouteObject[] => [
  {
    path: '/oauth-callback',
    element: <OauthCallback />,
  },
  {
    path: '/',
    element: <AuthenticatedRoot />,
    children: [
      {
        path: '/',
        element: <SelectGuild />,
      },
      {
        path: '/guild/:guildId',
        element: <GuildRoot />,
        children: [
          {
            path: '/guild/:guildId',
            element: <Dashboard />,
          },
          {
            path: '/guild/:guildId/audit',
            element: <Audit />,
          },
          {
            path: '/guild/:guildId/moderation',
            element: <Moderation />,
          },
          {
            path: '/guild/:guildId/settings',
            element: <Settings />,
          },
        ],
      },
    ],
  },
];
