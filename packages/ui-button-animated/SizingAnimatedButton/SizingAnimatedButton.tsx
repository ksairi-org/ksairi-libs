import { useState, useCallback } from "react";

import type { LayoutChangeEvent } from "react-native";

import { YStack } from "tamagui";

import { AnimatedButton } from "../AnimatedButton";
import type { AnimatedButtonProps } from "../AnimatedButton";

type SizingAnimatedButtonProps = Omit<AnimatedButtonProps, "width">;

const SizingAnimatedButton = (props: SizingAnimatedButtonProps) => {
  const [width, setWidth] = useState(0);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    [],
  );

  return (
    <YStack onLayout={onLayout}>
      {width > 0 && <AnimatedButton {...props} width={width} />}
    </YStack>
  );
};

export { SizingAnimatedButton };
export type { SizingAnimatedButtonProps };
