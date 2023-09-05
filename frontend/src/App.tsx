import { ChakraProvider } from '@chakra-ui/react';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { PageSpinner } from './components/page-spinner';
import { useRouter } from './hooks/use-router';
import { theme } from './theme';
import { ProvideUserContext } from './state/user.context';

const Router = () => {
  const routes = useRouter();
  return <RouterProvider router={routes} />;
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ProvideUserContext>
        <Suspense fallback={<PageSpinner />}>
          <Router />
        </Suspense>
      </ProvideUserContext>
    </ChakraProvider>
  );
};

export default App;
