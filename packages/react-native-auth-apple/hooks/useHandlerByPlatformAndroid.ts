import { useCallback } from "react";
import "react-native-get-random-values";
import { appleAuthAndroid } from "@invertase/react-native-apple-authentication";
import { v4 as uuid } from "uuid";

import { AppleSignInError, AppleHandledSignInResponse } from "../types";
import { NO_USER_DATA_MESSAGE } from "../constants";
import { decodeJWT } from "../utils";
/**
 * Hook to handle Apple sign-in on Android.
 *
 * This hook will check if the user is already authenticated, and if not,
 * it will prompt the user to sign-in with Apple.
 *
 * If the user is authenticated, it will return the user's email and
 * an `idToken` from the authentication response.
 *
 * If the user is not authenticated, it will throw an `AppleSignInError`.
 * @returns A promise that resolves to an object with the following properties:
 * - `idToken`: The authentication token returned by Apple.
 * - `nonce`: The nonce returned by Apple.
 * - `platform`: The platform on which the sign-in is being performed.
 * - `email`: The user's email address.
 */
const useHandlerByPlatformAndroid = () =>
  useCallback(async (): Promise<AppleHandledSignInResponse> => {
    // Generate secure, random values for state and nonce
    const rawNonce = uuid();
    const state = uuid();

    if (
      !process.env.EXPO_PUBLIC_ANDROID_APPLE_SIGN_IN_CLIENT_ID ||
      !process.env.EXPO_PUBLIC_ANDROID_APPLE_CALLBACK
    ) {
      throw new AppleSignInError(
        "CONFIGURATION_ERROR",
        "No APPLE_CLIENT_ID or APPLE_CALLBACK",
      );
    }
    // Configure the request
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: process.env.EXPO_PUBLIC_ANDROID_APPLE_SIGN_IN_CLIENT_ID,

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: process.env.EXPO_PUBLIC_ANDROID_APPLE_CALLBACK,

      // The type of response requested - code, id_token, or both.
      responseType: appleAuthAndroid.ResponseType.ALL,

      // The amount of user information requested from Apple.
      scope: appleAuthAndroid.Scope.ALL,

      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,

      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();

    if (!response.id_token || !response.nonce) {
      throw new AppleSignInError("SIGN_IN_FAILED", "no idToken or nonce");
    }

    return {
      identityToken: response.id_token,
      nonce: response.nonce,
      email: response.user?.email ?? decodeJWT(response.id_token).email, //email is encoded in token just in case is not being returned
      firstName: response.user?.name.firstName ?? null,
      lastName: response.user?.name.lastName ?? null,
      message: !response.user ? NO_USER_DATA_MESSAGE : null,
    };
  }, []);

export { useHandlerByPlatformAndroid };
