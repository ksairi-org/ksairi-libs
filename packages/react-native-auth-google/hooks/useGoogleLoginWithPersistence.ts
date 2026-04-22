import { useLoginWithPersistence } from "@react-auth-core";
import { useCallback } from "react";
import { useUserStore } from "@stores";
import { SignInResponse } from "@react-native-google-signin/google-signin";

/**
 * @returns A function that logs in with a Google token and nonce and persists
 *          the authentication tokens. If the login is successful, it
 *          will persist the tokens and return the data.
 * `identityToken` The idToken returned from Google
 * `nonce` The nonce returned from Google
 */
const useGoogleLoginWithPersistence = () => {
  const { handleLogInSocialNetwork, loginWithSocialError } =
    useLoginWithPersistence();
  const setKeyValue = useUserStore((state) => state.setKeyValue);

  const handleGoogleLoginWithPersistence = useCallback(
    async ({ data }: SignInResponse) => {
      if (data) {
        const { id: userId } = await handleLogInSocialNetwork({
          provider: "google",
          token: data.idToken,
        });

        const { user } = data;
        setKeyValue("firstName", user.givenName);
        setKeyValue("lastName", user.familyName);
        return {
          userId,
          firstName: user.givenName,
          lastName: user.familyName,
          email: user.email,
        };
      }
    },
    [handleLogInSocialNetwork, setKeyValue],
  );

  return { handleGoogleLoginWithPersistence, error: loginWithSocialError };
};

export { useGoogleLoginWithPersistence };
