import type { AppleSignInError, AppleSignInResponse } from "./types";
import type { AppleButtonProps } from "@invertase/react-native-apple-authentication";

import React, { useCallback, useImperativeHandle } from "react";

import { StyleSheet } from "react-native";

import { AppleButton } from "@invertase/react-native-apple-authentication";

import { useSignInWithApple } from "./hooks";

export interface AppleSignInButtonHandle {
  press: () => void;
}

type AppleSignInButtonProps = Omit<AppleButtonProps, "onPress"> & {
  onPress?: (...params: Parameters<AppleButtonProps["onPress"]>) => void;
  onSuccess?: (response: AppleSignInResponse) => void;
  onError?: (error: AppleSignInError) => void;
  ref?: React.Ref<AppleSignInButtonHandle>;
};

/**
 * The `AppleSignInButton` component provides a convenient way to sign in
 * with Apple on both Android and iOS devices.
 * @param root0 - AppleSignInButtonProps
 * @param root0.onPress - called when the user presses the button.
 * @param root0.onSuccess - called when the user is successfully signed in.
 * @param root0.onError - called when the user is not successfully signed in.
 * @param root0.ref - ref to access imperative methods like press()
 * @returns AppleSignInButton
 */
const AppleSignInButton = ({
  onPress,
  onError,
  onSuccess,
  ref,
  ...rest
}: AppleSignInButtonProps) => {
  const { handleSignInWithApple } = useSignInWithApple({
    onAppleSignInError: onError,
  });

  const handleOnPress = useCallback(
    async (...params: Parameters<AppleButtonProps["onPress"]>) => {
      onPress?.(...params);

      const response = await handleSignInWithApple();
      if (response) {
        onSuccess?.(response);
      }
    },
    [handleSignInWithApple, onPress, onSuccess],
  );

  useImperativeHandle(
    ref,
    () => ({
      press: () => {
        // Create a mock event object since handleOnPress expects it
        const mockEvent = {} as Parameters<AppleButtonProps["onPress"]>[0];
        handleOnPress(mockEvent);
      },
    }),
    [handleOnPress],
  );

  return (
    <AppleButton style={styles.appleButton} {...rest} onPress={handleOnPress} />
  );
};

const styles = StyleSheet.create({
  appleButton: {
    width: "100%", // You must specify a width
    height: 45, // You must specify a height
  },
});

export { AppleSignInButton };
