import { lazy, useEffect } from 'react';
import { useTitle } from '../../hooks/use-title';
import { useIsMod } from '../../hooks/use-is-mod.tsx';
import { useNavigate } from 'react-router';

const Settings = lazy(() => import('./settings-page.tsx'));
const Page = () => {
  useTitle('Settings');
  const isMod = useIsMod();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isMod) {
      navigate('/');
    }
  }, [isMod]);
  return <Settings />;
};
export default Page;
