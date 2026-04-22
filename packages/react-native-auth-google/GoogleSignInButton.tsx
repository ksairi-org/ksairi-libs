import type { GoogleSignInError, GoogleSignInResponse } from "./types";
import type { GoogleSigninButtonProps as GoogleButtonProps } from "@react-native-google-signin/google-signin";

import { useCallback } from "react";

import { StyleSheet } from "react-native";

import { GoogleSigninButton as GoogleButton } from "@react-native-google-signin/google-signin";

import { useSignInWithGoogle } from "./hooks";

type GoogleSigninButtonProps = GoogleButtonProps & {
  onSuccess?: (response: GoogleSignInResponse) => void;
  onError?: (error: GoogleSignInError) => void;
};

/**
 *
 * @param params - GoogleSigninButtonProps
 * @param params.onPress - onPress callback function
 * @param params.onError - onError callback function
 * @param params.onSuccess - onSuccess callback function
 * @returns GoogleSigninButton Component
 */
const GoogleSigninButton = ({
  onPress,
  onError,
  onSuccess,
  ...rest
}: GoogleSigninButtonProps = {}) => {
  const { handleSignInWithGoogle } = useSignInWithGoogle({
    onGoogleSignInError: onError,
  });

  const handleOnPress = useCallback(async () => {
    onPress?.();

    const response = await handleSignInWithGoogle();
    if (response) {
      onSuccess?.(response);
    }
  }, [handleSignInWithGoogle, onPress, onSuccess]);

  return (
    <GoogleButton
      style={styles.googleButton}
      {...rest}
      onPress={handleOnPress}
    />
  );
};

GoogleSigninButton.Size = GoogleButton.Size;

GoogleSigninButton.Color = GoogleButton.Color;

const styles = StyleSheet.create({
  googleButton: {
    width: "100%",
    height: 45,
  },
});

export { GoogleSigninButton };
