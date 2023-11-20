import { LogEntry } from '../domain/log-entry.tsx';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FC } from 'react';

export const LogEntriesTable: FC<{ auditLogs: LogEntry[] }> = ({
  auditLogs,
}) => (
  <TableContainer>
    <Table>
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Action</Th>
          <Th>Invoker</Th>
          <Th>Reason</Th>
          <Th>Target Type</Th>
          <Th>Target</Th>
        </Tr>
      </Thead>
      <Tbody>
        {auditLogs.map((entry) => (
          <Tr
            key={`${entry.createdAt}:${entry.action}:${entry.invokerId}:${entry.targetType}:${entry.targetId}`}
          >
            <Td>{entry.createdAt}</Td>
            <Td>{entry.action}</Td>
            <Td>{entry.invokerId}</Td>
            <Td>{entry.reason}</Td>
            <Td>{entry.targetType}</Td>
            <Td>{entry.targetId}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);
