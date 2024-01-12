import { extendTheme, withDefaultColorScheme } from '@chakra-ui/theme-utils';
import { defineStyleConfig } from '@chakra-ui/styled-system';
import { Colors, ThemeConfig } from '@chakra-ui/theme';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors: Colors = {
  primary: {
    50: '#e6eaff',
    100: '#bac1fa',
    200: '#8d97f1',
    300: '#616eeb',
    400: '#3544e4',
    500: '#1d2ccb',
    600: '#15219e',
    700: '#0e1872',
    800: '#060e46',
    900: '#01041c',
  },
  discord: {
    200: '#5865F2',
    300: '#2c3bed',
  },
};

export const theme = extendTheme(
  {
    config,
    colors,
    components: {
      Link: defineStyleConfig({
        baseStyle: {
          color: 'primary.300',
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' }),
);
