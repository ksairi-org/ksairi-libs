import { useState, useCallback, Children, isValidElement } from "react";
import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import { useWindowDimensions } from "react-native";
import { styled, YStackProps, ScrollView } from "tamagui";
import { GlassContainer, GlassContainerProps } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Edge } from "react-native-safe-area-context";

type YGlassContainerProps = Pick<YStackProps, "children"> & {
  backgroundColor?: string;
  shouldAutoResize?: boolean;
  edges?: Edge[];
} & GlassContainerProps;

type VerticalGlassContainerProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const StyledGlassContainer = styled(GlassContainer);
const validGlassComponents = [
  "ScreenYGlassSubContainer",
  "ScreenXGlassSubContainer",
];

const isGlassViewOrWrapper = (element: React.ReactElement): boolean => {
  const { type } = element;
  if (type === "GlassView") return true;
  // @ts-expect-error - accessing internal styled component properties
  if (validGlassComponents.includes(type?.staticConfig?.componentName)) return true;
  // @ts-expect-error - accessing type name
  const componentName = type?.displayName || type?.name || "";
  return validGlassComponents.includes(componentName);
};

const validateGlassViewChildren = (children: React.ReactNode) => {
  Children.toArray(children).forEach((child, index) => {
    if (!isValidElement(child)) {
      throw new Error(`Child at index ${index} is not a valid React element. All children must be GlassView components.`);
    }
    if (!isGlassViewOrWrapper(child)) {
      throw new Error(
        `Child at index ${index} is not a GlassView component. ` +
          `All direct children of ScreenGlassContainer must be GlassView or GlassView wrapper components.`,
      );
    }
  });
};

const VerticalGlassContainer = ({ children, style, onLayout }: VerticalGlassContainerProps) => (
  <StyledGlassContainer flexDirection="column" style={style} onLayout={onLayout}>
    {children}
  </StyledGlassContainer>
);

const ALL_EDGES: Edge[] = ["top", "bottom", "left", "right"];

const ScreenYGlassContainer = ({
  children,
  shouldAutoResize = true,
  backgroundColor,
  edges = ALL_EDGES,
}: YGlassContainerProps) => {
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

  validateGlassViewChildren(children);

  if (!shouldAutoResize) {
    return (
      <VerticalGlassContainer
        style={{ flexGrow: 1, backgroundColor, paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr }}
      >
        {children}
      </VerticalGlassContainer>
    );
  }

  if (contentHeight === null) {
    return (
      <VerticalGlassContainer
        style={{ backgroundColor, paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr }}
        onLayout={handleLayout}
      >
        {children}
      </VerticalGlassContainer>
    );
  }

  if (contentHeight > screenHeight) {
    return (
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr }}
      >
        <VerticalGlassContainer>{children}</VerticalGlassContainer>
      </ScrollView>
    );
  }

  return (
    <VerticalGlassContainer
      style={{ flexGrow: 1, backgroundColor, paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr }}
    >
      {children}
    </VerticalGlassContainer>
  );
};

export { ScreenYGlassContainer };
export type { YGlassContainerProps };
