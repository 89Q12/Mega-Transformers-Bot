import { useGuildApi } from '../../../../hooks/api/use-api.tsx';
import { TargetType } from '../domain/target-type.tsx';
import { Action } from '../domain/action.tsx';
import { LogEntry } from '../domain/log-entry.tsx';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../../../hooks/ui/use-pagination.tsx';

export interface AuditLogFilter {
  createdFrom?: string;
  createdTill?: string;
  targetType?: TargetType;
  action?: Action;
}

export const useGetAuditLogs = ({
  filter,
  pagination,
}: {
  filter: AuditLogFilter;
  pagination: Pagination;
}) => {
  const api = useGuildApi();
  const [auditLogs, setAuditLogs] = useState<{
    data: LogEntry[];
    total: number;
  }>();
  const [refreshing, setRefreshing] = useState(0);

  useEffect(
    () => {
      setRefreshing((it) => it + 1);
      api
        .query({
          ...filter,
          ...pagination,
        })
        .get(`/auditlog`)
        .json<{ data: LogEntry[]; total: number }>()
        .then((auditLogs) => setAuditLogs(auditLogs))
        .finally(() => setRefreshing((it) => it - 1));
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, filter, pagination.offset, pagination.limit],
  );

  const isRefreshing = useMemo(
    () => refreshing > 0 && !!auditLogs,
    [refreshing, auditLogs],
  );

  return { auditLogs, isRefreshing };
};
