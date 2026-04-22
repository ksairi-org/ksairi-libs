import type { NetInfoState } from '@react-native-community/netinfo';

import { useEffect, useRef, useState } from 'react';

import {
  fetch as netInfoFetch,
  addEventListener as netInfoAddEventListener,
} from '@react-native-community/netinfo';

const SET_ERROR_TIMEOUT = 10000;
const FIVE_HUNDRED = 500;

/**
 * @description - This function is a custom hook that sets up a network connection and change listener
 * @returns - Returns a boolean value that indicates whether the device has a network connection
 */
const useSetupNetworkConnectionChange = () => {
  const [hasNetworkConnection, setHasNetworkConnection] = useState(true);

  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearSetErrorTimeout = () => {
      if (errorTimeout.current) {
        console.log('clearing SetErrorTimeout');

        clearTimeout(errorTimeout.current);

        errorTimeout.current = null;
      }
    };

    const queueSetError = () => {
      if (!errorTimeout.current) {
        console.log('queuing set error');

        errorTimeout.current = setTimeout(
          () => setHasNetworkConnection(false),
          SET_ERROR_TIMEOUT,
        );
      }
    };

    const handleConnectionChange = (connectionInfo: NetInfoState) => {
      const { isInternetReachable } = connectionInfo;

      if (isInternetReachable === false) {
        queueSetError();
      } else if (isInternetReachable === true) {
        setHasNetworkConnection(true);

        clearSetErrorTimeout();
      }
    };

    const handleInitialNetInfoState = async () => {
      const initialNetInfoState = await netInfoFetch();

      // we want to immediately set the network state upon app first load / whenever this effect is run
      // For some reason, on iOS, `setNetworkError` needs to be queued up
      // I see no harm/downside to implementing this workaround
      if (initialNetInfoState.isInternetReachable === false) {
        setTimeout(() => setHasNetworkConnection(false), FIVE_HUNDRED);
      }
    };

    handleInitialNetInfoState();

    const unsubscribe = netInfoAddEventListener(handleConnectionChange);

    return () => {
      clearSetErrorTimeout();

      unsubscribe();
    };
  }, []);

  return hasNetworkConnection;
};

export { useSetupNetworkConnectionChange };
