import type { YStackProps } from "tamagui";
import { useState, useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import { useWindowDimensions } from "react-native";
import { YStack, ScrollView } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Edge } from "react-native-safe-area-context";

type ScreenContainerProps = Pick<YStackProps, "children"> & {
  backgroundColor?: YStackProps["backgroundColor"];
  shouldAutoResize?: boolean;
  edges?: Edge[];
};

const ALL_EDGES: Edge[] = ["top", "bottom", "left", "right"];

const ScreenContainer = ({
  children,
  shouldAutoResize = true,
  backgroundColor,
  edges = ALL_EDGES,
}: ScreenContainerProps) => {
  const [contentHeight, setContentHeight] = useState<null | number>(null);
  const screenHeight = useWindowDimensions().height;
  const insets = useSafeAreaInsets();

  const pt = edges.includes("top") ? insets.top : 0;
  const pb = edges.includes("bottom") ? insets.bottom : 0;
  const pl = edges.includes("left") ? insets.left : 0;
  const pr = edges.includes("right") ? insets.right : 0;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  }, []);

  if (!shouldAutoResize) {
    return (
      <YStack
        backgroundColor={backgroundColor}
        flexGrow={1}
        paddingTop={pt}
        paddingBottom={pb}
        paddingLeft={pl}
        paddingRight={pr}
      >
        {children}
      </YStack>
    );
  }

  if (contentHeight === null) {
    return (
      <YStack
        backgroundColor={backgroundColor}
        paddingTop={pt}
        paddingBottom={pb}
        paddingLeft={pl}
        paddingRight={pr}
        onLayout={handleLayout}
      >
        {children}
      </YStack>
    );
  }

  if (contentHeight > screenHeight) {
    return (
      <ScrollView
        backgroundColor={backgroundColor}
        flexGrow={1}
        contentContainerStyle={{ paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr }}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <YStack
      backgroundColor={backgroundColor}
      flexGrow={1}
      paddingTop={pt}
      paddingBottom={pb}
      paddingLeft={pl}
      paddingRight={pr}
    >
      {children}
    </YStack>
  );
};

export { ScreenContainer };
export type { ScreenContainerProps };
