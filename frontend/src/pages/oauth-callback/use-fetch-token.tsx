import { useContext, useState } from 'react';
import { useGlobalApi } from '../../hooks/api/use-api.tsx';
import { UserContext } from '../../state/user.context';
import { useFetchSelf } from '../../hooks/api/use-fetch-self.tsx';

interface FetchTokenResponse {
  user: {
    name: string;
    user_id: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const useFetchToken = () => {
  const api = useGlobalApi();
  const fetchSelf = useFetchSelf();
  const { set } = useContext(UserContext);
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
        .unauthorized(() => {
          setGrantFailed(true);
        })
        .json((response: FetchTokenResponse) => {
          fetchSelf(response.accessToken).then((user) => {
            set(response.accessToken, user);
          });
          resolve();
        })
        .catch((err) => reject(err)),
    );
  };

  return [fetchToken, grantFailed] as const;
};
