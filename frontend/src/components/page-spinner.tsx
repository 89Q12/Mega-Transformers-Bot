import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';

export const PageSpinner = () => (
  <Flex alignItems="center" justifyContent="center" height="100%" width="100%">
    <Spinner size="xl" thickness="4px" />
  </Flex>
);
