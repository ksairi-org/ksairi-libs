import type { GetProps } from "tamagui";

import type { ReactNode } from "react";

import { TouchableWithoutFeedback } from "react-native";

import { Image as ExpoImage } from "expo-image";
import { styled } from "tamagui";

import DEFAULT_ERROR_IMAGE from "../files/try-again.jpg";

const StyledImage = styled(ExpoImage, {});

type StyledImageProps = GetProps<typeof StyledImage>;

type ErrorProps = StyledImageProps & {
  ErrorComponent?: ReactNode;
  onRetryPress?: () => void;
};

/**
 *
 * @param props component properties
 * @param props.style custom style to be used by the ExpoImage child component
 * @param props.source custom error image to be used in place of the default error image
 * @param props.ErrorComponent custom error component to be used in place of the error component
 * @param props.onRetryPress fn() to be called when the component is pressed
 * @returns Error component to be show when loading the image returns in an error
 */
const Error = ({
  source = DEFAULT_ERROR_IMAGE,
  ErrorComponent,
  onRetryPress,
  ...styledImageProps
}: ErrorProps) => (
  <TouchableWithoutFeedback onPress={onRetryPress}>
    {ErrorComponent ? (
      ErrorComponent
    ) : (
      <StyledImage source={source} {...styledImageProps} />
    )}
  </TouchableWithoutFeedback>
);

export { Error };
