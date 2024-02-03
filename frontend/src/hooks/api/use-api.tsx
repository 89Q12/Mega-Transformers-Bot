import { useContext, useMemo } from 'react';
import wretch from 'wretch';
import { SelfContext } from '../../state/self.context.tsx';
import QueryStringAddon from 'wretch/addons/queryString';
import { useGuildId } from '../state/use-guild-id.tsx';
import { normalizeUrlMiddleware } from './normalize-url-middleware.tsx';

const instance = wretch().addon(QueryStringAddon);

const useApi = ({
  prependGuildId,
  guildId,
}: {
  prependGuildId: boolean;
  guildId?: string;
}) => {
  const user = useContext(SelfContext);

  return useMemo(() => {
    const authenticated = () => {
      if (!user?.token) return instance;
      return instance.auth(`Bearer ${user?.token}`);
    };
    return authenticated().middlewares([
      (next) => async (url, opts) => {
        if (prependGuildId && !guildId) {
          throw new Error(
            'Having a guild selected is required for this request',
          );
        }
        url =
          url.startsWith('/') && prependGuildId ? url.replace('/', '') : url;
        const prependedUrl = prependGuildId
          ? `${import.meta.env.VITE_API_URL}/guild/${guildId}/${url}`
          : import.meta.env.VITE_API_URL + url;
        const response = await next(prependedUrl, opts);
        if (response.status === 401) {
          user.clear();
        }
        return response;
      },
      normalizeUrlMiddleware,
    ]);
  }, [user, guildId, prependGuildId]);
};

export const useGlobalApi = () => useApi({ prependGuildId: false });
export const useGuildApi = () => {
  const guildId = useGuildId();
  return useApi({ prependGuildId: true, guildId });
};
