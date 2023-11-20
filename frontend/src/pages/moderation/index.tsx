import { lazy } from 'react';
import { useTitle } from '../../hooks/ui/use-title.tsx';

const Moderation = lazy(() => import('./moderation-page'));
const Page = () => {
  useTitle('Moderation');
  return <Moderation />;
};
export default Page;
