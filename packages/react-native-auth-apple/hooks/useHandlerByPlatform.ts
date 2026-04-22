import { Platform } from 'react-native';

import { useHandlerByPlatformAndroid } from './useHandlerByPlatformAndroid';
import { useHandlerByPlatformIOS } from './useHandlerByPlatformIOS';

/**
 * A hook that returns a function that signs in with Apple.
 * @returns A function that signs in with Apple.
 */
const useHandlerByPlatform = () => {
  const useHandleIOS = useHandlerByPlatformIOS();
  const useHandleAndroid = useHandlerByPlatformAndroid();

  const handlerByPlatform =
    Platform.OS === 'ios' ? useHandleIOS : useHandleAndroid;

  return {
    handlerByPlatform,
  };
};

export { useHandlerByPlatform };
