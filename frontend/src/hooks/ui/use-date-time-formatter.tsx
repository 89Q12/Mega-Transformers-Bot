import { useMemo } from 'react';

export const useDateTimeFormatter = (options?: Intl.DateTimeFormatOptions) =>
  useMemo(() => Intl.DateTimeFormat(undefined, options), [options]);
