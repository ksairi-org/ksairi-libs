import type { ColorTokens, Token } from "tamagui";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getTokenValue } from "tamagui";

import { ThrottledButton } from "@ksairi-org/ui-touchables";
import { CircularLoadingSpinner } from "../CircularLoadingSpinner";

type AnimatedButtonProps = {
  width: number;
  height?: number;
  padding?: Token;
  backgroundColor: ColorTokens;
  spinnerBackgroundColor?: ColorTokens;
  spinnerPieceColor?: ColorTokens;
  disabled?: boolean;
  loading?: boolean;
  opacity?: number;
  onPress?: () => void;
  pointerEvents?: "auto" | "none";
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const springConfig = { stiffness: 300, damping: 10, mass: 0.5 };

const AnimatedButton = ({
  width,
  height,
  padding,
  backgroundColor,
  spinnerBackgroundColor,
  spinnerPieceColor,
  disabled,
  loading,
  opacity,
  onPress,
  pointerEvents,
  style,
  children,
}: AnimatedButtonProps) => {
  const scale = useSharedValue(1);
  const buttonWidth = useSharedValue(width);
  const buttonOpacity = useSharedValue(opacity ?? (disabled ? 0.1 : 1));

  useEffect(() => {
    buttonWidth.value = withTiming(width, { duration: 300 });
  }, [width]);

  useEffect(() => {
    const targetOpacity = opacity ?? (disabled ? 0.1 : 1);
    buttonOpacity.value = withTiming(targetOpacity, { duration: 300 });
  }, [opacity, disabled]);

  const animateButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    width: buttonWidth.value,
  }));

  const animateTextScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animateButtonStyle, style]}>
      <ThrottledButton
        borderRadius={"$full"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundColor={backgroundColor}
        height={height}
        padding={padding && getTokenValue(padding)}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.95, springConfig);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springConfig);
        }}
        pointerEvents={pointerEvents ?? "auto"}
      >
        {loading ? (
          <CircularLoadingSpinner
            size={"$2xl"}
            backgroundColor={spinnerBackgroundColor ?? backgroundColor}
            spinningPieceColor={spinnerPieceColor ?? backgroundColor}
          />
        ) : (
          <Animated.View style={animateTextScaleStyle}>{children}</Animated.View>
        )}
      </ThrottledButton>
    </Animated.View>
  );
};

export { AnimatedButton };
export type { AnimatedButtonProps };
