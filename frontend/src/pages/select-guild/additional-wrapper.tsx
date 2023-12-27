import { Icon, Link, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { HiExternalLink } from 'react-icons/hi';

export const AdditionalWrapper: FC<{ clicked: number; fontSize: string }> = ({
  clicked,
  fontSize,
}) => (
  <Text
    fontSize={fontSize}
    as="div"
    position="absolute"
    textAlign="center"
    bottom="0"
    transform={`translateY(${Math.max((44 - clicked) * 0.56, 0)}em)`}
    transition="transform 0.2s ease-in-out"
  >
    <p>↑</p>
    <br />
    <br />
    <br />
    <p>↑</p>
    <br />
    <br />
    <br />
    <br />
    <p>👀</p>
    <br />
    <br />
    <br />
    <br />
    <p>
      Mega Transformers Bot was brought to you by{' '}
      <Link href="https://github.com/89Q12" isExternal={true}>
        89Q12 <Icon as={HiExternalLink} />
      </Link>{' '}
      and&nbsp;
      <Link href="https://github.com/yuri-becker" isExternal>
        yuri-becker <Icon as={HiExternalLink} />
      </Link>
      .
    </p>
  </Text>
);
