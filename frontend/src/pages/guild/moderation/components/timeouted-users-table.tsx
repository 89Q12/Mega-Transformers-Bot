import { FC } from 'react';
import { DiscordGuildMember } from '../../../../hooks/api/moderation/use-fetch-moderation-users.tsx';
import {
  Avatar,
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Heading } from '@chakra-ui/layout';
import { useDateTimeFormatter } from '../../../../hooks/ui/use-date-time-formatter.tsx';

export const TimeoutedUsersTable: FC<{ users: DiscordGuildMember[] }> = ({
  users,
}) => {
  const dateTimeFormatter = useDateTimeFormatter({
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const timeoutedUsers = users
    .filter((user) => !!user.communicationDisabledUntil)
    .filter(
      (user) => Date.parse(user.communicationDisabledUntil!) >= Date.now(),
    );

  if (timeoutedUsers.length === 0) {
    return null;
  }

  return (
    <>
      <Heading size="md" as="h2" marginTop={8}>
        Members with timeout
      </Heading>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Display name</Th>
              <Th>Username</Th>
              <Th>Timeout until</Th>
            </Tr>
          </Thead>
          <Tbody>
            {timeoutedUsers.map((user) => (
              <Tr key={user.userId}>
                <Td>
                  <Avatar src={user.avatarUrl} size={'sm'} />
                  <Text
                    as="strong"
                    verticalAlign={'middle'}
                    marginLeft={2}
                    paddingTop=".5rem"
                  >
                    {user.displayName}
                  </Text>
                  {user.bot && (
                    <Badge marginLeft={2} marginBottom="-.5rem">
                      Bot
                    </Badge>
                  )}
                </Td>
                <Td>{user.username}</Td>
                <Td>
                  {dateTimeFormatter.format(
                    Date.parse(user.communicationDisabledUntil!),
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
