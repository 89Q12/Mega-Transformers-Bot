import { lazy } from 'react';
import { useTitle } from '../../hooks/ui/use-title.tsx';

const Dashboard = lazy(() => import('./dashboard-page'));
const Page = () => {
  useTitle('Dashboard');
  return <Dashboard />;
};
export default Page;
