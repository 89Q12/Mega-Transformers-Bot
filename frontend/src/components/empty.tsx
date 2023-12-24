import { Flex } from '@chakra-ui/layout';
import { FC, PropsWithChildren } from 'react';
import { Text } from '@chakra-ui/react';

export const Empty: FC<PropsWithChildren> = ({ children }) => (
  <Flex alignItems="center" justifyContent="center" height="100%" width="100%">
    <Text color="var(--chakra-colors-chakra-subtle-text)">{children}</Text>
  </Flex>
);
