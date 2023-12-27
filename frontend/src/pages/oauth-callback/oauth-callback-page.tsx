import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageSpinner } from '../../components/page-spinner';
import { useGlobalApi } from '../../hooks/api/use-api.tsx';
import { Flex, Link } from '@chakra-ui/react';
import { useFetchToken } from './use-fetch-token';

const OauthCallbackPage = () => {
  const api = useGlobalApi();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [fetchToken, grantFailed] = useFetchToken();

  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');
    const path = state ? decodeURIComponent(state) : '/';
    if (!code) {
      navigate(path, { replace: true });
      return;
    }
    fetchToken(code)?.then(() => {
      navigate(path, { replace: true });
    });
  }, [api, navigate, params, fetchToken]);
  return !grantFailed ? (
    <PageSpinner />
  ) : (
    <Flex height="100%" justifyContent="center" alignItems="center">
      <p>
        We could not log you in. Please&nbsp;
        <Link to="/" as={RouterLink}>
          try again
        </Link>
        .
      </p>
    </Flex>
  );
};

export default OauthCallbackPage;
