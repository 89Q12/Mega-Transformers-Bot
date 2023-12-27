import { lazy, useEffect } from 'react';
import { useTitle } from '../../../hooks/ui/use-title.tsx';
import { useIsMod } from '../../../hooks/state/use-is-mod.tsx';
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
  }, [isMod, navigate]);
  return <Settings />;
};
export default Page;
