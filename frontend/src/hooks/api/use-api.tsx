import { useContext, useMemo } from 'react';
import wretch from 'wretch';
import { UserContext } from '../../state/user.context.tsx';
import QueryStringAddon from 'wretch/addons/queryString';
import { normalizeUrlMiddleware } from './normalize-url-middleware.tsx';
import { useGuildId } from '../state/use-guild-id.tsx';

const instance = wretch(import.meta.env.VITE_API_URL)
  .middlewares([normalizeUrlMiddleware])
  .addon(QueryStringAddon);

const useApi = ({ prependGuildId }: { prependGuildId: boolean }) => {
  const user = useContext(UserContext);
  const guildId = useGuildId();

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
        const prependedUrl = prependGuildId
          ? `/guild/${guildId}/${url.replace(/^\//, '')}`
          : url;
        const response = await next(prependedUrl, opts);
        if (response.status === 401) {
          user.clear();
        }
        return response;
      },
    ]);
  }, [user, guildId, prependGuildId]);
};

export const useGlobalApi = () => useApi({ prependGuildId: false });
export const useGuildApi = () => useApi({ prependGuildId: true });
