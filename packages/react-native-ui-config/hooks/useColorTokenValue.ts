import type { ColorTokens, ThemeKeys } from '@tamagui/core';

import { useTheme } from 'tamagui';

/**
 * @param color color token to get the value from
 * @returns value of of the provided token according to the current theme. Default color black is returned if token is not found
 */
const useColorTokenValue = (color: ColorTokens | undefined): string => {
  const theme = useTheme();

  return !color || !theme[color as ThemeKeys]?.val
    ? 'black'
    : // @ts-ignore
      theme[color as ThemeKeys].val;
};

export { useColorTokenValue };
