import { Box, ChakraProvider, ColorModeScript, VStack } from '@chakra-ui/react'
import { lazy } from 'react'
import { Header } from './components/header'
import { useIsAuthenticted } from './hooks/use-is-authenticated'
import { theme } from './theme'

const LoginPage = lazy(() => import('./pages/login'))

const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticted()

  return <ChakraProvider theme={theme}>
    <VStack height="100%" alignItems="stretch">
      <Header/>
      <Box flexGrow={1} padding='3'>
        {!isAuthenticated && <LoginPage/>}
      </Box>
    </VStack>
  </ChakraProvider>
}

export default App
