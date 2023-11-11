import { Flex, Heading } from '@chakra-ui/layout';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useRouteError } from 'react-router';
import { Link } from 'react-router-dom';

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    direction="column"
    height="100%"
  >
    {children}
  </Flex>
);

export const ErrorHandler = () => {
  const error = useRouteError();

  if ((error as any).status === 404) {
    return (
      <Layout>
        <Heading size="xl">404 щ(ಥДಥщ)</Heading>
        <p>
          This page does not exist, please go <Link to="/">back to safety</Link>
          .
        </p>
      </Layout>
    );
  }

  useEffect(() => {
    console.error(error);
  }, [error]);

  return <p>{String(error)}</p>;
};
