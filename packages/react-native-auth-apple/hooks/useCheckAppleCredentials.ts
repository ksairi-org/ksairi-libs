import { useEffect } from "react";

import AppleAuth from "@invertase/react-native-apple-authentication";
import { useAuthStore } from "@react-auth-storage";

/**
 * This hook listens for when Apple credentials have been revoked.
 * When they are revoked, it calls handleLogout to log the user out.
 * If the user's device does not support Apple Sign In, this hook will not add the event listener.
 */
const useCheckAppleCredentials = () => {
  const handleLogout = useAuthStore((state) => state.handleLogout);

  useEffect(() => {
    if (!AppleAuth.isSupported) {
      return;
    }

    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return AppleAuth.onCredentialRevoked(async () => {
      console.warn("Apple User Credentials have been Revoked");

      handleLogout();
    });
  }, [handleLogout]);
};

export { useCheckAppleCredentials };
