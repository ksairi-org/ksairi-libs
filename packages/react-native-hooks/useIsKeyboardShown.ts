import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardOffsetHeight } from './useKeyboardOffsetHeight';

/**
 * Hook that returns if keyboard is showing
 * @returns true if keyboard is showing
 */
const useIsKeyboardShown = () =>
  useKeyboardOffsetHeight(0) > useSafeAreaInsets().bottom;

export { useIsKeyboardShown };
