import { useMemo } from 'react';

import { Platform } from 'react-native';

import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook to get the keyboard offset height
 *
 * useKeyboard hook has keyboardShown, keyboardHeight
 * but there's some latency in terms of when the keyboard displays and when they actually change
 * @param additionalSpacing additional spacing
 * @returns keyboard height + additional spacing provided
 */
const useKeyboardOffsetHeight = (additionalSpacing: number) => {
  const { bottom } = useSafeAreaInsets();
  const { coordinates } = useKeyboard();

  const startY = coordinates.start?.screenY || 0;
  const endY = coordinates.end.screenY;

  const calculatedKeyboardHeight =
    Platform.OS === 'ios' ? startY - endY : coordinates.end.height;

  const keyboardOffsetHeight = useMemo(() => {
    if (!calculatedKeyboardHeight || calculatedKeyboardHeight < 0) {
      return bottom === 0 ? additionalSpacing : bottom;
    }

    return calculatedKeyboardHeight + additionalSpacing;
  }, [bottom, calculatedKeyboardHeight, additionalSpacing]);

  return keyboardOffsetHeight;
};

export { useKeyboardOffsetHeight };
