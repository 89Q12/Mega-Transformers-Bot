import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Box } from '@chakra-ui/layout';
import {
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';

const styles = css`
  flex-shrink: 0;
  display: block;
  overflow: hidden;
  cursor: pointer;

  border-radius: 50%;
  border: 0 double transparent;
  transition:
    border-width 0.2s ease-out,
    border-radius 0.2s ease-out;

  // Gradient border - invisible when not active
  background-image: linear-gradient(
    180deg,
    var(--chakra-colors-primary-300),
    var(--chakra-colors-primary-500)
  );
  background-origin: border-box;
`;
const linkStyles = css`
  &.active,
  &:active,
  &:hover {
    border-radius: 30%;
  }

  &:focus,
  &.active,
  &:active {
    border-width: 2px;
  }
`;

const useTileSize = () =>
  useBreakpointValue(
    {
      base: '3rem',
      sm: '4rem',
    },
    { fallback: 'sm' },
  );

export const Tile: FC<{
  image: string;
  text: string;
  to: string;
}> = ({ image, text, to }) => {
  const size = useTileSize();
  return (
    <Box
      as={NavLink}
      to={to}
      width={size}
      height={size}
      css={css(styles, linkStyles)}
    >
      <Tooltip label={text} hasArrow placement="right">
        <Image src={image} alt={text} />
      </Tooltip>
    </Box>
  );
};

export const UserTile: FC<{
  image: string;
  logout: () => void;
}> = ({ image, logout }) => {
  const size = useTileSize();
  return (
    <Menu>
      <MenuButton
        width={size}
        height={size}
        css={styles}
        _expanded={{
          borderWidth: '2px',
          borderRadius: '30%',
        }}
      >
        <Image src={image} alt={'More'} />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<HiArrowLeftOnRectangle />} onClick={logout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
