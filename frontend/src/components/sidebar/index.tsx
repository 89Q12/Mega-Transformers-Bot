import { Box, Divider, VStack } from '@chakra-ui/layout';
import { StyleProps } from '@chakra-ui/styled-system';
import { FC } from 'react';
import { useLogout } from '../../hooks/state/use-logout.tsx';
import { useSelf } from '../../hooks/state/use-self.tsx';
import { gapChildrenVertically } from '../../util/gap-children.tsx';
import cheapLogo from './cheaplogo.png';
import { Tile, UserTile } from './tile.tsx';

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
        display="flex"
        flexDirection="column"
        css={gapChildrenVertically(2)}
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
