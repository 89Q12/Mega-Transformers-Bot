import {
  Button,
  Flex,
  Heading,
  Icon,
  chakra,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { HiCog, HiFlag, HiHome, HiQueueList } from 'react-icons/hi2';
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
  const isActive = location.pathname === path.pathname;
  const size = useBreakpointValue(
    {
      base: 'sm',
      sm: 'md',
    },
    { fallback: 'sm' },
  );

  return (
    <Button
      to={to}
      variant="link"
      as={RouterLink}
      disabled={isActive}
      leftIcon={icon}
      color={isActive ? 'primary.300' : 'primary.50'}
      size={size}
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
      md: 'initial',
    },
    { fallback: 'md' },
  );
  const gap = useBreakpointValue(
    {
      base: '2',
      sm: '4',
    },
    { fallback: 'sm' },
  );

  return (
    <chakra.header
      display="flex"
      backgroundColor="whiteAlpha.100"
      padding="4"
      gap={gap}
      flexWrap="wrap"
    >
      <Heading size="md" display={displayTitle}>
        🐶 Cardinal System
      </Heading>
      {isAuthenticated && (
        <>
          <Flex height="100%" alignItems="center" gap={gap} flexGrow={1}>
            <RouterLinkButton to="/" icon={<Icon as={HiHome} />}>
              Dashboard
            </RouterLinkButton>
            <RouterLinkButton to="/audit" icon={<Icon as={HiQueueList} />}>
              Audit
            </RouterLinkButton>
            <RouterLinkButton to="/moderation" icon={<Icon as={HiFlag} />}>
              Moderation
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