import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { PageSpinner } from '../../components/page-spinner';
import { useApi } from '../../hooks/use-api';

const OauthCallbackPage = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get('code');
    if (!code) {
      navigate('/', { replace: true });
      return;
    }
    api.get(`/auth/discord?code=${code}`).text((it) => console.log(it));
  }, [api, navigate, params]);
  return <PageSpinner />;
};

export default OauthCallbackPage;
