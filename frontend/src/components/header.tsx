import {
  Button,
  chakra,
  Icon,
  StyleProps,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { HiCog, HiFlag, HiHome, HiQueueList } from 'react-icons/hi2';
import {
  Link as RouterLink,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { useIsMod } from '../hooks/state/use-is-mod.tsx';
import { useGuildId } from '../hooks/state/use-guild-id.tsx';

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

export const Header: FC<StyleProps> = (props) => {
  const isMod = useIsMod();
  const guildId = useGuildId();
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
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      padding={4}
      gap={gap}
      {...props}
    >
      <RouterLinkButton to={`/guild/${guildId}`} icon={<Icon as={HiHome} />}>
        Dashboard
      </RouterLinkButton>
      <RouterLinkButton
        to={`/guild/${guildId}/audit`}
        icon={<Icon as={HiQueueList} />}
      >
        Audit
      </RouterLinkButton>
      <RouterLinkButton
        to={`/guild/${guildId}/moderation`}
        icon={<Icon as={HiFlag} />}
      >
        Moderation
      </RouterLinkButton>
      {isMod && (
        <RouterLinkButton
          to={`/guild/${guildId}/settings`}
          icon={<Icon as={HiCog} />}
        >
          Settings
        </RouterLinkButton>
      )}
    </chakra.header>
  );
};
