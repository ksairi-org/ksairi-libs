import type { Image, ImageProps as ExpoImageProps } from "expo-image";

import type { ReactNode } from "react";

type ImageRef = Image;

type ImageProps = ExpoImageProps & {
  ErrorComponent?: ReactNode;
  errorImageSource?: ImageSource;
  autoScaleBasedOnScreenDimensions?: boolean;
  width?: number;
  height?: number;
  maxFontScaleToApply?: number;
};

type ImageSourceStateStatus = "loading" | "error" | "success";

type ImageSource = ExpoImageProps["source"];

export type { ImageRef, ImageProps, ImageSource, ImageSourceStateStatus };
