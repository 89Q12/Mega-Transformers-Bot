import { lazy } from 'react';
import { useTitle } from '../../hooks/ui/use-title.tsx';
import { useIsAuthenticated } from '../../hooks/state/use-is-authenticated.tsx';
import { Navigate } from 'react-router-dom';

const OauthCallback = lazy(() => import('./oauth-callback-page'));
const Page = () => {
  const isAuthenticated = useIsAuthenticated();
  useTitle('');
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <OauthCallback />;
};
export default Page;
