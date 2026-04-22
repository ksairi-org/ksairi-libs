import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * Initializes the Google Signin library.
 *
 * This function should be called before using any other functions from the
 * `@react-native-google-signin/google-signin` library.
 *
 */
const initializeGoogleSignin = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
};

export { initializeGoogleSignin };
