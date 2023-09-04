import {
  Button,
  Flex,
  Heading,
  Icon,
  chakra,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { HiCog, HiHome, HiQueueList } from 'react-icons/hi2';
import {
  Link as RouterLink,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { useIsAuthenticted } from '../hooks/use-is-authenticated';

const RouterLinkButton: FC<
  PropsWithChildren<{ to: string; icon: ReactElement }>
> = ({ to, icon, children }) => {
  const path = useResolvedPath(to);
  const location = useLocation();
  console.log(to + ' ' + location.pathname + ' ' + path.pathname);
  const isActive = location.pathname === path.pathname;

  return (
    <Button
      to={to}
      variant="link"
      as={RouterLink}
      disabled={isActive}
      leftIcon={icon}
      color={isActive ? 'primary.300' : 'primary.50'}
    >
      {children}
    </Button>
  );
};

export const Header: FC = () => {
  const isAuthenticated = useIsAuthenticted();
  const displayTitle = useBreakpointValue(
    {
      base: 'none',
      sm: 'initial',
    },
    { fallback: 'sm' },
  );

  return (
    <chakra.header
      display="flex"
      backgroundColor="whiteAlpha.100"
      padding="4"
      gap="4"
    >
      <Heading size="md" display={displayTitle}>
        🐶 Cardinal System
      </Heading>
      {isAuthenticated && (
        <>
          <Flex height="100%" alignItems="center" gap={4} flexGrow={1}>
            <RouterLinkButton to="/" icon={<Icon as={HiHome} />}>
              Dashboard
            </RouterLinkButton>
            <RouterLinkButton to="/audit" icon={<Icon as={HiQueueList} />}>
              Audit
            </RouterLinkButton>
          </Flex>
          <Flex height="100%">
            <RouterLinkButton
              to="/settings"
              icon={<Icon as={HiCog} />}
            ></RouterLinkButton>
          </Flex>
        </>
      )}
    </chakra.header>
  );
};
