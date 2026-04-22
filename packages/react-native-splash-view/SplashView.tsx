import type {
  AnimatedSplashImageProps,
  RiveSourceResult,
  SplashViewProps,
} from "./types";
import type { RiveRef } from "rive-react-native";

import { useEffect, useImperativeHandle, useRef, useState } from "react";

import { Platform, StyleSheet, Image } from "react-native";

import * as Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Rive, { LoopMode, Fit, Alignment } from "rive-react-native";
import { styled } from "tamagui";

const StyledImage = styled(Image, {
  style: {
    width: "100%",
    height: "100%",
  },
  resizeMode: "contain",
});

const styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10000,
  },
});

SplashScreen.preventAutoHideAsync();

const AnimatedSplashImage = ({
  opacity,
  launchImageUrl,
}: AnimatedSplashImageProps) => (
  <Animated.View
    pointerEvents={"none"}
    style={[
      styles.animatedView,
      {
        backgroundColor: Constants.default.expoConfig?.splash?.backgroundColor,
        opacity,
      },
    ]}
  >
    <StyledImage source={launchImageUrl} />
  </Animated.View>
);

/**
 * A splash screen that plays a Rive animation and then fades out.
 * - One of `source` or `launchImageUrl` must be provided.
 * - source must be a Rive file, it can be either a remote URL or a local resource.
 * - launchImageUrl must be an image source, it can be either a remote URL or a local resource.
 * - If `source` is provided, the animation will play and then fade out.
 * - If `launchImageUrl` is provided, it will be displayed as a static image until the animation fades out.
 * @param {React.ReactNode} children - The children to render.
 * @param {() => void} onPlay - Called when the animation starts playing.
 * @param {() => void} onPause - Called when the animation is paused.
 * @param {() => void} onStop - Called when the animation is stopped.
 * @param {(animationName: string, loopMode: LoopMode) => void} onLoopEnd - Called when the animation loops.
 * @param {(stateMachineName: string, stateName: string) => void} onStateChanged - Called when the state machine changes state.
 * @param {(rnRiveError: RNRiveError) => void} onError - Called when an error occurs.
 * @param {string} androidResourceName - The name of the resource to load.
 * @param {string} url - The URL of the Rive file to load.
 * @param {string} artboardName - The name of the artboard to load.
 * @param {string} animationName - The name of the animation to load.
 * @param {string} stateMachineName - The name of the state machine to load.
 * @param {Alignment} alignment - The alignment of the animation.
 * @param {Fit} fit - The fit of the animation.
 * @param {StyleProps} animationViewStyle - The style of the Rive component.
 * @param {StyleProps} style - The style of the splash view.
 * @param {number} fadeOutDelay - The delay before starting the fade-out animation. Defaults to 0.
 * @param {number} fadeOutDuration - The duration of the fade out animation. Defaults to 1500.
 * @param {string} testID - The test ID.
 * @param {number} launchScreenHideMs - How long to wait before hiding the native Launch screen with `expo-splash-screen`. Defaults to 0.
 * @param loopMode - Rive `LoopMode` for animation playback. Defaults to `OneShot`.
 * @returns {React.ReactElement} The component with Rive animation.
 */

const getRiveSource = (source: unknown): RiveSourceResult => {
  const { uri } = Image.resolveAssetSource(source);
  // 1. Remote file (http/https) → url
  if (/^https?:\/\//.test(uri)) {
    return { url: uri };
  }

  // 2. iOS – file inside the .app bundle → resourceName = bare filename
  if (/^file:\/\//.test(uri) && Platform.OS === "ios") {
    const match = uri.match(/.*\.app\/(.*)\.riv$/);
    if (match) return { resourceName: match[1] }; // “swipe_up”
    // EAS/OTA downloaded file – treat as network asset
    return { url: uri };
  }

  // 3. Android release or raw-resource name → resourceName
  return { resourceName: uri };
};

const SplashView = ({
  source,
  alignment = Alignment.Center,
  fit = Fit.Contain,
  animationViewStyle,
  fadeOutDuration = 1500,
  children,
  launchScreenHideMs = 0,
  style,
  fadeOutDelay = 0,
  loopMode = LoopMode.OneShot,
  launchImageUrl,
  ref,
  ...rest
}: SplashViewProps) => {
  const riveSource = getRiveSource(source); // { url } *or* { resourceName }
  const riveRef = useRef<RiveRef>(null);

  const hasNoAnimation = !source;

  const [hasAnimationEnded, setHasAnimationEnded] = useState(false);

  const opacity = useSharedValue(1);

  // // Android has a weird behavior - when autoplay is set to false, the Rive logo gets displaced momentarily and "jumps" around
  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     riveRef.current?.stop();
  //   }
  // }, []);

  // Handles hiding the static native Launch screen
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await SplashScreen.hideAsync();

      if (hasNoAnimation) {
        // No animation provided. Splash screen has been hidden!

        return;
      }

      riveRef.current?.play(undefined, loopMode);
    }, launchScreenHideMs);

    return () => clearTimeout(timeout);
  }, [hasNoAnimation, launchScreenHideMs, loopMode]);

  // Handles fading out the SplashView, as we don't have access to the time of the animation
  useEffect(() => {
    function handleOnAnimationEnd() {
      setHasAnimationEnded(true);
    }

    const timeout = setTimeout(() => {
      opacity.value = withTiming(
        0,
        { duration: fadeOutDuration },
        (isFinished) => {
          if (isFinished) {
            runOnJS(handleOnAnimationEnd)();
          }
        },
      );
    }, fadeOutDelay);

    return () => clearTimeout(timeout);
  }, [fadeOutDelay, fadeOutDuration, opacity]);

  useImperativeHandle(
    ref,
    () => ({
      setInputState: (triggerStateMachineName, inputName, value) =>
        riveRef.current?.setInputState(
          triggerStateMachineName,
          inputName,
          value,
        ),
      play: () => riveRef.current?.play(),
      pause: () => riveRef.current?.pause(),
      stop: () => riveRef.current?.stop(),
      reset: () => riveRef.current?.reset(),
      fireState: (triggerStateMachineName, inputName) =>
        riveRef.current?.fireState(triggerStateMachineName, inputName),
      touchBegan: (x, y) => riveRef.current?.touchBegan(x, y),
      touchEnded: (x, y) => riveRef.current?.touchEnded(x, y),
      setTextRunValue: (name, value) =>
        riveRef.current?.setTextRunValue(name, value),
      getBooleanState: (inputName) =>
        riveRef.current?.getBooleanState(inputName),
      getNumberState: (inputName) => riveRef.current?.getNumberState(inputName),
      getBooleanStateAtPath: (inputName, path) =>
        riveRef.current?.getBooleanStateAtPath(inputName, path),
      getNumberStateAtPath: (inputName, path) =>
        riveRef.current?.getNumberStateAtPath(inputName, path),
      fireStateAtPath: (inputName, path) =>
        riveRef.current?.fireStateAtPath(inputName, path),
      setInputStateAtPath: (inputName, path, value) =>
        riveRef.current?.setInputStateAtPath(inputName, path, value),
      setBoolean: (path, value) => riveRef.current?.setBoolean(path, value),
      setTextRunValueAtPath: (textRunName, value, path) =>
        riveRef.current?.setTextRunValueAtPath(textRunName, path, value),
      setString: (path, value) => riveRef.current?.setString(path, value),
      setNumber: (path, value) => riveRef.current?.setNumber(path, value),
      setColor: (path, value) => riveRef.current?.setColor(path, value),
      setEnum: (path, value) => riveRef.current?.setColor(path, value),
      trigger: (path) => riveRef.current?.trigger(path),
      internalNativeEmitter: () => riveRef.current?.internalNativeEmitter(),
      viewTag: () => riveRef.current?.viewTag(),
    }),
    [],
  );

  if (hasAnimationEnded) {
    return null;
  }

  if (hasNoAnimation) {
    if (!launchImageUrl) {
      throw new Error(
        "launchImageUrl is required when no animation is provided",
      );
    }

    return (
      <AnimatedSplashImage launchImageUrl={launchImageUrl} opacity={opacity} />
    );
  }

  return (
    <Animated.View
      pointerEvents={"none"}
      style={[styles.animatedView, { opacity }, style]}
    >
      <Rive
        ref={ref}
        {...rest}
        {...riveSource}
        style={animationViewStyle}
        autoplay={Platform.OS === "android"}
        onError={(err) => {
          console.error(`${err.type}: ${err.message}`);
        }}
      />
    </Animated.View>
  );
};

export { SplashView };
