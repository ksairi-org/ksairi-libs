import type {
  ImageProps as ExpoImageProps,
  ImageSourceStateStatus,
} from "../types";
import type { ImageLoadEventData } from "expo-image";
import type { GetProps } from "tamagui";

import { ComponentRef, useCallback, useState } from "react";

import type { ImageErrorEventData } from "react-native";

import { Image as UnstyledExpoImage } from "expo-image";
import { styled } from "tamagui";

import { Error } from "../Error";
import { getImageDimensions } from "@react-native-functions";
import { useFontScale } from "@react-native-hooks";
import DEFAULT_NO_IMAGE from "../files/example.jpg";

const StyledExpoImage = styled(UnstyledExpoImage, {});

type StyledImageProps = GetProps<typeof StyledExpoImage>;

type ImageProps = Omit<StyledImageProps, "width" | "height"> &
  Omit<ExpoImageProps, "transition"> & {
    ref?: React.Ref<ComponentRef<typeof StyledExpoImage>>;
  };

const Image = ({
  ErrorComponent,
  errorImageSource,
  onLoad: onLoadProp,
  onError: onErrorProp,
  width,
  height,
  autoScaleBasedOnScreenDimensions = true,
  maxFontScaleToApply,
  ref,
  ...imageProps
}: ImageProps) => {
  const fontScale = useFontScale();

  const { width: maybeScaledWidth, height: maybeScaledHeight } =
    getImageDimensions({
      width,
      height,
      autoScaleBasedOnScreenDimensions,
      defaultSize: 30,
      fontScale,
      maxFontScaleToApply,
    });

  const [status, setStatus] = useState<ImageSourceStateStatus>("loading");

  const onError = useCallback(
    (event: ImageErrorEventData) => {
      onErrorProp?.(event);

      setStatus("error");
    },
    [onErrorProp],
  );

  const onRetryPress = useCallback(() => {
    if (status === "error") {
      setStatus("loading");
    }
  }, [status]);

  const onLoad = useCallback(
    (event: ImageLoadEventData) => {
      onLoadProp?.(event);

      setStatus("success");
    },
    [onLoadProp],
  );

  if (status === "error") {
    return (
      <Error
        onRetryPress={onRetryPress}
        ErrorComponent={ErrorComponent}
        {...imageProps}
        source={errorImageSource}
        width={maybeScaledWidth}
        height={maybeScaledHeight}
      />
    );
  }

  if (
    typeof imageProps.source === "object" &&
    imageProps.source !== null &&
    "uri" in imageProps.source &&
    !imageProps.source.uri
  ) {
    return (
      <StyledExpoImage
        ref={ref}
        {...imageProps}
        source={DEFAULT_NO_IMAGE}
        onLoad={onLoad}
        onError={onError}
        width={maybeScaledWidth}
        height={maybeScaledHeight}
      />
    );
  }

  return (
    <StyledExpoImage
      ref={ref}
      {...imageProps}
      onLoad={onLoad}
      onError={onError}
      width={maybeScaledWidth}
      height={maybeScaledHeight}
    />
  );
};

export { Image };
