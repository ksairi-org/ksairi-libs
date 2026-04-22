import type { GoogleSignInErrorType, GoogleSignInResponse } from "../types";

import { useCallback, useEffect } from "react";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { GoogleSignInError } from "../types";
import { useGoogleLoginWithPersistence } from "./useGoogleLoginWithPersistence";
import { initializeGoogleSignin } from "../utils";

type UseSignInWithGoogleOptions = {
  onGoogleSignInError?: (error: GoogleSignInError) => void;
};

const CANCELLED_BY_USER_ERROR = "Google sign in was cancelled by user";

const isErrorOfCancelledByUser = (message: string) =>
  message.includes(CANCELLED_BY_USER_ERROR);

/**
 * This hook provides a way to sign in with Google on both Android and iOS devices.
 * The hook uses the `@react-native-google-signin/google-signin` library to
 * handle the sign in process.
 *
 * The hook returns an object with two functions:
 * - `handleSignInWithGoogle`: A function that signs in with Google.
 * - `handleSignOutWithGoogle`: A function that signs out from Google.
 *
 * If the sign in process fails, the hook will throw an error.
 * @param options The options to use when signing in.
 * @param options.onGoogleSignInError The function to call if the sign in process fails.
 * @returns An object with two functions: `handleSignInWithGoogle` and
 *   `handleSignOutWithGoogle`.
 */
const useSignInWithGoogle = ({
  onGoogleSignInError,
}: UseSignInWithGoogleOptions = {}) => {
  const { handleGoogleLoginWithPersistence, error } =
    useGoogleLoginWithPersistence();

  const handleSignOutWithGoogle = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch (err) {
      console.error("GOOGLE SIGN OUT ERROR--->", err);
    }
  }, []);

  const treatError = useCallback(
    async (error: unknown) => {
      if (!isErrorOfCancelledByUser) {
        console.error("GOOGLE SIGN IN ERROR--->", error);
      }

      await handleSignOutWithGoogle();
      if (error instanceof GoogleSignInError) {
        if (!isErrorOfCancelledByUser(error.message)) {
          onGoogleSignInError?.(error);
        }
      } else if (isErrorWithCode(error)) {
        let errorCode: GoogleSignInErrorType = "UNKNOWN";

        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            errorCode = "IN_PROGRESS";

            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            errorCode = "PLAY_SERVICES_NOT_AVAILABLE";

            break;
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            errorCode = "SIGN_IN_CANCELLED";

            break;
          case statusCodes.SIGN_IN_REQUIRED:
            // user needs to be signed in
            errorCode = "SIGN_IN_REQUIRED";

            break;
          default:
            break;
        }
        if (!isErrorOfCancelledByUser(error.message)) {
          onGoogleSignInError?.(
            new GoogleSignInError(errorCode, error.message, error),
          );
        }
      } else if (error instanceof Error) {
        // an error that's not related to google sign in occurred
        onGoogleSignInError?.(
          new GoogleSignInError("UNKNOWN", error.message, error),
        );
      } else {
        onGoogleSignInError?.(
          new GoogleSignInError("UNKNOWN", "Unknown error"),
        );
      }
    },
    [handleSignOutWithGoogle, onGoogleSignInError],
  );

  useEffect(() => {
    if (error) {
      treatError(error);
    }
  }, [error, treatError]);

  const handleSignInWithGoogle =
    useCallback(async (): Promise<GoogleSignInResponse | void> => {
      try {
        initializeGoogleSignin();
        const hasPlayService = await GoogleSignin.hasPlayServices();

        if (!hasPlayService) {
          throw new GoogleSignInError(
            "PLAY_SERVICES_NOT_AVAILABLE",
            "Invalid hasPlayService",
          );
        }
        const googleData = await GoogleSignin.signIn();
        const response = await handleGoogleLoginWithPersistence(googleData);
        if (!isSuccessResponse(googleData)) {
          throw new GoogleSignInError(
            "SIGN_IN_CANCELLED",
            CANCELLED_BY_USER_ERROR,
          );
        }

        return response;
      } catch (error) {
        treatError(error);
      }
    }, [handleGoogleLoginWithPersistence, treatError]);

  return { handleSignInWithGoogle, handleSignOutWithGoogle };
};

export { useSignInWithGoogle };
