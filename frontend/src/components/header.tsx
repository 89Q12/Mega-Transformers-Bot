import { Heading, chakra } from '@chakra-ui/react';
import { FC } from 'react';
export const Header: FC = () => {
  return (
    <chakra.header display="flex" backgroundColor="whiteAlpha.100" padding="3">
      <Heading size="lg">🐶 Cardinal System</Heading>
    </chakra.header>
  );
};
