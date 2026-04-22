import { useCallback } from "react";

import { appleAuth } from "@invertase/react-native-apple-authentication";

import { AppleSignInError, AppleHandledSignInResponse } from "../types";
import { NO_USER_DATA_MESSAGE } from "../constants";
import { decodeJWT } from "../utils";

/**
 * Hook to handle Apple sign-in on iOS.
 *
 * This hook will check if the user is already authenticated, and if not,
 * it will prompt the user to sign-in with Apple.
 *
 * If the user is authenticated, it will return the `idToken` from the authentication response.
 *
 * If the user is not authenticated, it will throw an `AppleSignInError`.
 * @returns A promise that resolves to an object with the following properties:
 * - `identityToken`: The authentication token returned by Apple.
 * - `nonce`: The nonce returned by Apple.
 * - `fullName`: full name returned from Apple.
 */
const useHandlerByPlatformIOS = () =>
  useCallback(async (): Promise<AppleHandledSignInResponse> => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    if (!appleAuthRequestResponse.identityToken) {
      throw new AppleSignInError("SIGN_IN_FAILED", "no idToken");
    }

    return {
      ...appleAuthRequestResponse,
      email:
        appleAuthRequestResponse.email ??
        decodeJWT(appleAuthRequestResponse.identityToken).email, //email is encoded in token just in case is not being returned
      firstName: appleAuthRequestResponse.fullName.givenName,
      lastName: appleAuthRequestResponse.fullName.familyName,
      message:
        appleAuthRequestResponse.fullName === null
          ? NO_USER_DATA_MESSAGE
          : null,
    };
  }, []);

export { useHandlerByPlatformIOS };
