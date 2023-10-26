import { useContext, useState } from 'react';
import { useApi } from '../../hooks/use-api';
import { UserContext } from '../../state/user.context';

interface FetchTokenResponse {
  user: {
    name: string;
    user_id: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const useFetchToken = () => {
  const api = useApi();
  const { setToken } = useContext(UserContext);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [grantFailed, setGrantFailed] = useState<boolean>(false);

  const fetchToken = (code: string) => {
    if (usedCodes.includes(code)) return;
    setUsedCodes((codes) => [...codes, code]);
    return new Promise<void>((resolve, reject) =>
      api
        .get(`/auth/login?code=${code}`)
        .badRequest(() => {
          // We dont want the promise to resolve here
          setGrantFailed(true);
        })
        .json((response: FetchTokenResponse) => {
          setToken(response.accessToken);
          resolve();
        })
        .catch((err) => reject(err)),
    );
  };

  return [fetchToken, grantFailed] as const;
};
