import type { YStackProps } from "tamagui";

import { useState, useCallback } from "react";

import type { LayoutChangeEvent } from "react-native";
import { useWindowDimensions } from "react-native";

import { YStack, ScrollView } from "tamagui";

type ScreenContainerProps = Pick<
  YStackProps,
  "children" | "backgroundColor"
> & {
  shouldAutoResize?: boolean;
};

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @param props.backgroundColor container's background color
 * @param props.shouldAutoResize should the container auto resize if the height of the children is larger than the screen height
 * @returns JSX container containing its children
 */
const ScreenContainer = ({
  children,
  shouldAutoResize = true,
  backgroundColor,
}: ScreenContainerProps) => {
  const [contentHeight, setContentHeight] = useState<null | number>(null);
  const screenHeight = useWindowDimensions().height;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    setContentHeight(height);
  }, []);

  if (!shouldAutoResize) {
    return (
      <YStack backgroundColor={backgroundColor} flexGrow={1}>
        {children}
      </YStack>
    );
  }

  if (contentHeight === null) {
    return (
      <YStack backgroundColor={backgroundColor} onLayout={handleLayout}>
        {children}
      </YStack>
    );
  }

  if (contentHeight > screenHeight) {
    return (
      <ScrollView backgroundColor={backgroundColor} flexGrow={1}>
        {children}
      </ScrollView>
    );
  }

  return (
    <YStack backgroundColor={backgroundColor} flexGrow={1}>
      {children}
    </YStack>
  );
};

export { ScreenContainer };

export type { ScreenContainerProps };
