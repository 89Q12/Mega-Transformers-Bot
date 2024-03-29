import { lazy } from 'react';
import { useTitle } from '../../../hooks/ui/use-title.tsx';

const Audit = lazy(() => import('./audit-page.tsx'));
const Page = () => {
  useTitle('Audit');
  return <Audit />;
};
export default Page;
