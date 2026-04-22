import type { AppleSignInErrorType, AppleSignInResponse } from "../types";

import { useCallback, useEffect } from "react";

import { appleAuth } from "@invertase/react-native-apple-authentication";

import { useAppleLoginWithPersistence } from "./useAppleLoginWithPersistence";
import { useHandlerByPlatform } from "./useHandlerByPlatform";
import { AppleSignInError } from "../types";
import { isErrorWithCode } from "../utils";

type UseSignInWithAppleOptions = {
  onAppleSignInError?: (error: AppleSignInError) => void;
};

const ERROR_TITLE = "APPLE SIGN IN ERROR--->";

const isErrorOfCancelledByUser = (message: string) =>
  message.includes(
    "(com.apple.AuthenticationServices.AuthorizationError error 1001.)",
  ) ||
  message.includes(
    "(com.apple.AuthenticationServices.AuthorizationError error 1000.)",
  ) ||
  message.includes("E_SIGNIN_CANCELLED_ERROR");

/**
 * This hook provides a way to sign in with Apple on both Android and iOS devices.
 * The hook returns an object with a function:
 * - `handleSignInWithApple`: A function that signs in with Apple.
 *
 * The `handleSignInWithApple` function returns a promise that resolves to an object
 * with the following properties:
 * - `tokens`: The authentication tokens returned by the server.
 * - `email`: The email of the user that signed in.
 *
 * If the sign-in process fails, the hook will throw an error.
 * @param options The options to use when signing in.
 * @param options.onAppleSignInError The function to call if the sign-in process fails.
 * @returns An object with the function `handleSignInWithApple`.
 */
const useSignInWithApple = ({
  onAppleSignInError,
}: UseSignInWithAppleOptions = {}) => {
  const { handleAppleLoginWithPersistence, error } =
    useAppleLoginWithPersistence();

  const { handlerByPlatform } = useHandlerByPlatform();

  const treatError = useCallback(
    (error: unknown) => {
      if (error instanceof AppleSignInError) {
        if (!isErrorOfCancelledByUser(error.message)) {
          console.error(ERROR_TITLE, error);
        }

        onAppleSignInError?.(error);
      } else if (isErrorWithCode(error)) {
        if (!isErrorOfCancelledByUser(error.message)) {
          console.error(ERROR_TITLE, error);
        }
        let errorCode: AppleSignInErrorType = "UNKNOWN";
        switch (error.code) {
          case appleAuth.Error.CANCELED:
            errorCode = "SIGN_IN_CANCELLED";

            break;
          case appleAuth.Error.UNKNOWN:
            errorCode = "UNKNOWN";

            break;
          case appleAuth.Error.INVALID_RESPONSE:
            errorCode = "INVALID_RESPONSE";

            break;
          case appleAuth.Error.NOT_HANDLED:
            errorCode = "NOT_HANDLED";

            break;
          case appleAuth.Error.FAILED:
            errorCode = "SIGN_IN_FAILED";

            break;
        }
        if (!isErrorOfCancelledByUser(error.message)) {
          onAppleSignInError?.(
            new AppleSignInError(errorCode, error.message, error),
          );
        }
      } else if (error instanceof Error) {
        // an error that's not related to google sign in occurred
        onAppleSignInError?.(
          new AppleSignInError("UNKNOWN", error.message, error),
        );
      } else {
        onAppleSignInError?.(new AppleSignInError("UNKNOWN", "Unknown error"));
      }
    },
    [onAppleSignInError],
  );

  useEffect(() => {
    if (error) {
      treatError(error);
    }
  }, [error, treatError]);

  const handleSignInWithApple =
    useCallback(async (): Promise<AppleSignInResponse | void> => {
      try {
        const response = await handlerByPlatform();
        if (!response.identityToken || !response.nonce) {
          throw new AppleSignInError(
            "SIGN_IN_FAILED",
            "Something went wrong on handle by platform",
          );
        }
        const loginResponse = await handleAppleLoginWithPersistence(response);
        return loginResponse;
      } catch (error) {
        treatError(error);
      }
    }, [handleAppleLoginWithPersistence, handlerByPlatform, treatError]);

  return { handleSignInWithApple };
};

export { useSignInWithApple };
