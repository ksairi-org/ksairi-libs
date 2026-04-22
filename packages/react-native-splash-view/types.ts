import type { SharedValue, StyleProps } from "react-native-reanimated";
import type Rive from "rive-react-native";
import type { LoopMode } from "rive-react-native";

import type { ImageProps } from "react-native";

type RiveProps = Parameters<typeof Rive>[0];

type AnimatedSplashImageProps = {
  opacity: SharedValue<number>;
  launchImageUrl: NonNullable<SplashViewProps["launchImageUrl"]>;
};

type SplashViewProps = Omit<
  RiveProps,
  "resourceName" | "url" | "autoplay" | "style"
> & {
  fadeOutDelay?: number;
  fadeOutDuration?: number;
  animationViewStyle?: RiveProps["style"];
  launchScreenHideMs?: number;
  style?: StyleProps;
  loopMode?: LoopMode;
} & (
    | {
        source?: undefined;
        // when source is undefined,
        launchImageUrl: NonNullable<ImageProps["source"]>;
      }
    | {
        source: NonNullable<RiveProps["source"]>;
        launchImageUrl?: undefined;
      }
  );

type RiveSourceResult =
  | { url: string; resourceName?: never }
  | { resourceName: string; url?: never };

export type { SplashViewProps, AnimatedSplashImageProps, RiveSourceResult };
