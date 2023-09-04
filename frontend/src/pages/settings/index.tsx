import { lazy } from 'react';
import { useTitle } from '../../hooks/use-title';

const Settings = lazy(() => import('./users-page'));
const Page = () => {
  useTitle('Settings');
  return <Settings />;
};
export default Page;
