import { useState, useCallback, Children, isValidElement } from "react";
import type { LayoutChangeEvent } from "react-native";
import { useWindowDimensions } from "react-native";
import { ScrollView, styled, YStackProps } from "tamagui";
import { GlassContainer, GlassContainerProps } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Edge } from "react-native-safe-area-context";

type ScreenXGlassContainerProps = Pick<
  YStackProps,
  "children" | "backgroundColor"
> & {
  shouldAutoResize?: boolean;
  edges?: Edge[];
} & GlassContainerProps;

type VerticalGlassContainerProps = Omit<YStackProps, "flexDirection">;

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

const HorizontalGlassContainer = (props: VerticalGlassContainerProps) => (
  <StyledGlassContainer flexDirection="row" {...props}>
    {props.children}
  </StyledGlassContainer>
);

const ALL_EDGES: Edge[] = ["top", "bottom", "left", "right"];

const ScreenXGlassContainer = ({
  children,
  shouldAutoResize = true,
  backgroundColor,
  edges = ALL_EDGES,
  ...props
}: ScreenXGlassContainerProps) => {
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
      <HorizontalGlassContainer
        backgroundColor={backgroundColor}
        flexGrow={1}
        paddingTop={pt}
        paddingBottom={pb}
        paddingLeft={pl}
        paddingRight={pr}
        {...props}
      >
        {children}
      </HorizontalGlassContainer>
    );
  }

  if (contentHeight === null) {
    return (
      <HorizontalGlassContainer
        backgroundColor={backgroundColor}
        paddingTop={pt}
        paddingBottom={pb}
        paddingLeft={pl}
        paddingRight={pr}
        onLayout={handleLayout}
        {...props}
      >
        {children}
      </HorizontalGlassContainer>
    );
  }

  if (contentHeight > screenHeight) {
    return (
      <ScrollView
        backgroundColor={backgroundColor}
        flexGrow={1}
        horizontal
        contentContainerStyle={{ paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr }}
      >
        <HorizontalGlassContainer {...props}>{children}</HorizontalGlassContainer>
      </ScrollView>
    );
  }

  return (
    <HorizontalGlassContainer
      backgroundColor={backgroundColor}
      flexGrow={1}
      paddingTop={pt}
      paddingBottom={pb}
      paddingLeft={pl}
      paddingRight={pr}
      {...props}
    >
      {children}
    </HorizontalGlassContainer>
  );
};

export { ScreenXGlassContainer };
export type { ScreenXGlassContainerProps };
