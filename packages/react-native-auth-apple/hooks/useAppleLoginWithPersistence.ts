import { useLoginWithPersistence } from "@react-auth-core";
import { useCallback } from "react";
import { AppleHandledSignInResponse } from "../types";
import { useUserStore } from "@stores";

/**
 * @returns A function that logs in with a Apple token and nonce and persists
 *          the authentication tokens. If the login is successful, it
 *          will persist the tokens and return the data.
 * `identityToken` The idToken returned from Apple
 * `nonce` The nonce returned from Apple
 */
const useAppleLoginWithPersistence = () => {
  const { handleLogInSocialNetwork, loginWithSocialError } =
    useLoginWithPersistence();
  const setKeyValue = useUserStore((state) => state.setKeyValue);

  const handleAppleLoginWithPersistence = useCallback(
    async ({
      identityToken,
      nonce,
      firstName,
      lastName,
      email,
    }: AppleHandledSignInResponse) => {
      const { id: userId } = await handleLogInSocialNetwork({
        provider: "apple",
        token: identityToken,
        nonce,
      });

      if (firstName) {
        // fullName is set only the first time the user logs in
        setKeyValue("firstName", firstName);
        setKeyValue("lastName", lastName);
      }

      return { userId, firstName, lastName, email };
    },
    [handleLogInSocialNetwork, setKeyValue],
  );

  return { handleAppleLoginWithPersistence, error: loginWithSocialError };
};

export { useAppleLoginWithPersistence };
