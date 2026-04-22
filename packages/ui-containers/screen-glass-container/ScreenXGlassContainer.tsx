import { useState, useCallback, Children, isValidElement } from "react";

import type { LayoutChangeEvent } from "react-native";
import { useWindowDimensions } from "react-native";

import { ScrollView, styled, YStackProps } from "tamagui";
import { GlassContainer, GlassContainerProps } from "expo-glass-effect";

type ScreenXGlassContainerProps = Pick<
  YStackProps,
  "children" | "backgroundColor"
> & {
  shouldAutoResize?: boolean;
} & GlassContainerProps;

type VerticalGlassContainerProps = Omit<YStackProps, "flexDirection">;

const StyledGlassContainer = styled(GlassContainer);
const validGlassComponents = [
  "ScreenYGlassSubContainer",
  "ScreenXGlassSubContainer",
];

/**
 * Check if a component is a GlassView or wraps a GlassView
 */
const isGlassViewOrWrapper = (element: React.ReactElement): boolean => {
  const { type } = element;
  // Direct GlassView
  if (type === "GlassView") {
    return true;
  }

  // Check if it's a styled component wrapping GlassView
  // @ts-expect-error - accessing internal styled component properties
  if (validGlassComponents.includes(type?.staticConfig?.componentName)) {
    return true;
  }

  // Check if component name suggests it's a GlassView wrapper
  // @ts-expect-error - accessing type name
  const componentName = type?.displayName || type?.name || "";
  if (validGlassComponents.includes(componentName)) {
    return true;
  }

  return false;
};

/**
 * Validates that all children are GlassView components
 */
const validateGlassViewChildren = (children: React.ReactNode) => {
  const childArray = Children.toArray(children);

  childArray.forEach((child, index) => {
    if (!isValidElement(child)) {
      throw new Error(
        `Child at index ${index} is not a valid React element. All children must be GlassView components.`,
      );
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

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @param props.backgroundColor container's background color
 * @param props.shouldAutoResize should the container auto resize if the height of the children is larger than the screen height
 * @returns JSX container containing its children
 */
const ScreenXGlassContainer = ({
  children,
  shouldAutoResize = true,
  backgroundColor,
  ...props
}: ScreenXGlassContainerProps) => {
  const [contentHeight, setContentHeight] = useState<null | number>(null);
  const screenHeight = useWindowDimensions().height;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    setContentHeight(height);
  }, []);

  validateGlassViewChildren(children);

  if (!shouldAutoResize) {
    return (
      <HorizontalGlassContainer
        backgroundColor={backgroundColor}
        flexGrow={1}
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
        onLayout={handleLayout}
        {...props}
      >
        {children}
      </HorizontalGlassContainer>
    );
  }

  if (contentHeight > screenHeight) {
    return (
      <ScrollView backgroundColor={backgroundColor} flexGrow={1} horizontal>
        <HorizontalGlassContainer {...props}>
          {children}
        </HorizontalGlassContainer>
      </ScrollView>
    );
  }

  return (
    <HorizontalGlassContainer
      backgroundColor={backgroundColor}
      flexGrow={1}
      {...props}
    >
      {children}
    </HorizontalGlassContainer>
  );
};

export { ScreenXGlassContainer };

export type { ScreenXGlassContainerProps };
