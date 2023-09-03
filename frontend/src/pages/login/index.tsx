import { Button, Flex, Icon } from "@chakra-ui/react"
import { FC } from "react"
import { FaDiscord } from "react-icons/fa6"

const LoginPage: FC = () => {
  return <Flex justifyContent='center' alignItems='center' height='100%'>
    <Button leftIcon={<Icon as={FaDiscord}/>} colorScheme='discord' size='lg' color="white">Login with Discord</Button>
    </Flex>
}

export default LoginPage