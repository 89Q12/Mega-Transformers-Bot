import { lazy } from 'react';
import { useTitle } from '../../hooks/use-title';

const Audit = lazy(() => import('./audit-page'));
const Page = () => {
  useTitle('Audit');
  return <Audit />;
};
export default Page;
