import { FC } from 'react';
import { Box, VStack } from '@chakra-ui/layout';
import { useSelf } from '../../hooks/state/use-self.tsx';
import { Tile, UserTile } from './tile.tsx';
import { Divider, Spacer, StyleProps } from '@chakra-ui/react';
import cheapLogo from './cheaplogo.png';
import { useLogout } from '../../hooks/state/use-logout.tsx';
import { repeat } from 'rambda';

export const Sidebar: FC<StyleProps> = (props) => {
  const self = useSelf();
  const logout = useLogout();

  if (!self) {
    return null;
  }
  return (
    <VStack
      backgroundColor="whiteAlpha.100"
      height="100%"
      padding={3}
      {...props}
    >
      <Tile image={cheapLogo} text="Home" to="/" />
      <Divider />
      <Box
        flexGrow={1}
        overflowY="auto"
        gap={2}
        display="flex"
        flexDirection="column"
      >
        {self.guilds.map(({ image, name, guildId }) => (
          <Tile
            key={guildId}
            image={image}
            text={name}
            to={`/guild/${guildId}`}
          />
        ))}
      </Box>
      <Divider />
      <UserTile image={self.avatarUrl} logout={logout} />
    </VStack>
  );
};
