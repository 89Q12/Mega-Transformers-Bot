import { Colors, ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const colors: Colors = {
  discord: {
    200:'#5865F2',
    300: '#2c3bed'
  }

}

export const theme = extendTheme({
  config, colors
})