import { Box } from '@chakra-ui/layout';
import { useFetchModerationUsers } from '../../../hooks/api/moderation/use-fetch-moderation-users.tsx';
import { PageSpinner } from '../../../components/page-spinner.tsx';
import { Empty } from '../../../components/empty.tsx';
import { TimeoutedUsersTable } from './components/timeouted-users-table.tsx';
import { gapChildrenVertically } from '../../../util/gap-children.tsx';
import { Actions } from './components/actions.tsx';

const ModerationPage = () => {
  const { users } = useFetchModerationUsers();
  if (!users) {
    return <PageSpinner />;
  }
  if (users.length === 0) {
    return <Empty>There are no members.</Empty>;
  }

  return (
    <Box
      flexDirection="column"
      justifyContent="center"
      css={gapChildrenVertically()}
    >
      <Actions members={users} />
      <TimeoutedUsersTable users={users} />
    </Box>
  );
};

export default ModerationPage;
