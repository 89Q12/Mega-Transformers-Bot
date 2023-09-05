import { lazy } from 'react';
import { useTitle } from '../../hooks/use-title';

const Moderation = lazy(() => import('./moderation-page'));
const Page = () => {
  useTitle('Moderation');
  return <Moderation />;
};
export default Page;
