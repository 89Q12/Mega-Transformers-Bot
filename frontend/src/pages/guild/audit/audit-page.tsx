import {
  AuditLogFilter,
  useGetAuditLogs,
} from './hooks/use-get-audit-logs.tsx';
import { FC, useState } from 'react';
import { PageSpinner } from '../../../components/page-spinner.tsx';
import { LogEntry } from './domain/log-entry.tsx';
import { LogEntriesTable } from './components/log-entries-table.tsx';
import { Box } from '@chakra-ui/layout';
import { useConditionalToast } from '../../../hooks/ui/use-conditional-toast.tsx';
import { Filter } from './components/filter.tsx';
import { usePagination } from '../../../hooks/ui/use-pagination.tsx';
import { Empty } from '../../../components/empty.tsx';

const Content: FC<{ auditLogs: LogEntry[] | undefined }> = ({ auditLogs }) => {
  if (!auditLogs) {
    return <PageSpinner />;
  }
  if (auditLogs.length === 0) {
    return <Empty>No audit logs match the current filter.</Empty>;
  }
  return <LogEntriesTable auditLogs={auditLogs} />;
};

const AuditPage = () => {
  const [filter, setFilter] = useState<AuditLogFilter>({});
  const { pagination, Paginator } = usePagination({ pageSize: 50 });
  const { auditLogs, isRefreshing } = useGetAuditLogs({ filter, pagination });

  useConditionalToast(isRefreshing, {
    title: 'Refreshing...',
    status: 'loading',
  });

  return (
    <Box flexDirection="column" gap={6} justifyContent="center">
      <Filter onChange={setFilter} />
      <Paginator total={auditLogs?.total} />
      <Content auditLogs={auditLogs?.data} />
      <Paginator total={auditLogs?.total} />
    </Box>
  );
};

export default AuditPage;
