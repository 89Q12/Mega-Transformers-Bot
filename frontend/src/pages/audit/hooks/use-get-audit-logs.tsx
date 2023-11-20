import { useApi } from '../../../hooks/api/use-api.tsx';
import { useGuildId } from '../../../hooks/state/use-guild-id.tsx';
import { TargetType } from '../domain/target-type.tsx';
import { Action } from '../domain/action.tsx';
import { LogEntry } from '../domain/log-entry.tsx';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../../hooks/ui/use-pagination.tsx';

export interface AuditLogFilter {
  createdFrom?: string;
  createdTill?: string;
  targetTypes?: TargetType[];
  actions?: Action[];
}

export const useGetAuditLogs = ({
  filter,
  pagination,
}: {
  filter: AuditLogFilter;
  pagination: Pagination;
}) => {
  const api = useApi();
  const guildId = useGuildId();
  const [auditLogs, setAuditLogs] = useState<{
    data: LogEntry[];
    total: number;
  }>();
  const [refreshing, setRefreshing] = useState(0);

  useEffect(() => {
    setRefreshing((it) => it + 1);
    api
      .query({ ...filter, ...pagination })
      .get(`/auditlog/${guildId}`)
      .json<{ data: LogEntry[]; total: number }>()
      .then((auditLogs) => setAuditLogs(auditLogs))
      .finally(() => setRefreshing((it) => it - 1));
  }, [guildId, api, filter, pagination.offset, pagination.limit]);

  const isRefreshing = useMemo(
    () => refreshing > 0 && !!auditLogs,
    [refreshing, auditLogs],
  );

  return { auditLogs, isRefreshing };
};
