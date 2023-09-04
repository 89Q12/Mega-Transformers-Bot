import { lazy } from 'react';
import { useTitle } from '../../hooks/use-title';

const OauthCallback = lazy(() => import('./oauth-callback-page'));
const Page = () => {
  useTitle('');
  return <OauthCallback />;
};
export default Page;
