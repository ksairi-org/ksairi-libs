import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import type { LayoutChangeEvent } from "react-native";

import { Button, type ButtonProps, Spacer, YStack } from "tamagui";

type GenericButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign"
> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const ButtonWithoutIcons = ({ children, ...props }: GenericButtonProps) => (
  <Button {...props} unstyled={true} alignItems={"center"}>
    {children}
  </Button>
);

const ButtonWithLeftIcon = ({
  children,
  leftIcon,
  ...props
}: GenericButtonProps & Required<Pick<GenericButtonProps, "leftIcon">>) => {
  const [spacerWidth, setSpacerWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setSpacerWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <Button {...props} unstyled={true} alignItems={"center"} flexDirection={"row"}>
      <YStack padding={"$button-lg"} onLayout={onLayout}>
        {leftIcon}
      </YStack>
      <YStack flex={1} alignItems={"center"}>
        {children}
      </YStack>
      <Spacer width={spacerWidth} />
    </Button>
  );
};

const ButtonWithRightIcon = ({
  children,
  rightIcon,
  ...props
}: GenericButtonProps & Required<Pick<GenericButtonProps, "rightIcon">>) => {
  const [spacerWidth, setSpacerWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setSpacerWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <Button {...props} unstyled={true} alignItems={"center"} flexDirection={"row"}>
      <Spacer width={spacerWidth} />
      <YStack flex={1} alignItems={"center"}>
        {children}
      </YStack>
      <YStack padding={"$button-lg"} onLayout={onLayout}>
        {rightIcon}
      </YStack>
    </Button>
  );
};

const ButtonWithTwoIcons = ({
  children,
  rightIcon,
  leftIcon,
  ...props
}: GenericButtonProps &
  Required<Pick<GenericButtonProps, "leftIcon" | "rightIcon">>) => (
  <Button {...props} unstyled={true} alignItems={"center"} flexDirection={"row"}>
    <YStack padding={"$button-lg"}>{leftIcon}</YStack>
    <YStack flex={1} alignItems={"center"}>
      {children}
    </YStack>
    <YStack padding={"$button-lg"}>{rightIcon}</YStack>
  </Button>
);

const GenericButton = ({
  children,
  leftIcon,
  rightIcon,
  ...props
}: GenericButtonProps) => {
  if (leftIcon && rightIcon) {
    return (
      <ButtonWithTwoIcons {...props} leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </ButtonWithTwoIcons>
    );
  }

  if (leftIcon) {
    return (
      <ButtonWithLeftIcon {...props} leftIcon={leftIcon}>
        {children}
      </ButtonWithLeftIcon>
    );
  }

  if (rightIcon) {
    return (
      <ButtonWithRightIcon {...props} rightIcon={rightIcon}>
        {children}
      </ButtonWithRightIcon>
    );
  }

  return <ButtonWithoutIcons {...props}>{children}</ButtonWithoutIcons>;
};

export type { GenericButtonProps };
export { GenericButton };
