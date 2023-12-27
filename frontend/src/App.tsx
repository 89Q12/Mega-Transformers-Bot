import { ChakraProvider } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { PageSpinner } from './components/page-spinner';
import { useRouter } from './hooks/ui/use-router.tsx';
import { theme } from './theme';
import { ProvideSelfContext } from './state/self.context.tsx';
import { ProvideGuildSelfContext } from './state/guild-self.context.tsx';

const Router = () => {
  const routes = useRouter();
  return <RouterProvider router={routes} />;
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ProvideSelfContext>
        <ProvideGuildSelfContext>
          <Suspense fallback={<PageSpinner />}>
            <Router />
          </Suspense>
        </ProvideGuildSelfContext>
      </ProvideSelfContext>
    </ChakraProvider>
  );
};

export default App;
