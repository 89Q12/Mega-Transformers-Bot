import { Box, ChakraProvider, VStack } from '@chakra-ui/react';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { Header } from './components/header';
import { PageSpinner } from './components/page-spinner';
import { useRouter } from './hooks/use-router';
import { theme } from './theme';

const App: React.FC = () => {
  const routes = useRouter();

  return (
    <ChakraProvider theme={theme}>
      <Suspense fallback={<PageSpinner />}>
        <RouterProvider router={routes} />
      </Suspense>
    </ChakraProvider>
  );
};

export default App;
