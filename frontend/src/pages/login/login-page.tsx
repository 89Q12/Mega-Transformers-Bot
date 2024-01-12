import { Button } from '@chakra-ui/button';
import { Icon } from '@chakra-ui/icon';
import { Flex } from '@chakra-ui/layout';
import { FC } from 'react';
import { FaDiscord } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

const LoginPage: FC = () => {
  const { pathname } = useLocation();
  return (
    <Flex justifyContent="center" alignItems="center" height="100%">
      <a
        href={`https://discord.com/oauth2/authorize?redirect_uri=${encodeURIComponent(
          import.meta.env.VITE_DISCORD_CALLBACK_URL,
        )}&client_id=${
          import.meta.env.VITE_DISCORD_OAUTH_CLIENT_ID
        }&response_type=code&scope=identify&state=${encodeURIComponent(
          pathname,
        )}`}
      >
        <Button
          leftIcon={<Icon as={FaDiscord} />}
          colorScheme="discord"
          size="lg"
          color="white"
        >
          Login with Discord
        </Button>
      </a>
    </Flex>
  );
};

export default LoginPage;
