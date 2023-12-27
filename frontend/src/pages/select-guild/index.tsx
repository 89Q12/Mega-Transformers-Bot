import { lazy } from 'react';
import { useTitle } from '../../hooks/ui/use-title.tsx';

const SelectGuild = lazy(() => import('./select-guild-page.tsx'));

const Page = () => {
  useTitle('');
  return <SelectGuild />;
};

export default Page;
