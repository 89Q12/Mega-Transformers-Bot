import { ConfiguredMiddleware } from 'wretch';

export const normalizeUrlMiddleware: ConfiguredMiddleware = (next) => {
  const matchDoubleSlashes = /^(http(s)?:\/\/[^/]*)(\/\/|\/)/;
  return (url, opts) => {
    return next(url.replace(matchDoubleSlashes, '$1/'), opts);
  };
};
