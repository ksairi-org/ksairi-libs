import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import type { LayoutChangeEvent } from "react-native";

import { Button, type ButtonProps, Spacer, XStack, YStack } from "tamagui";

type BaseButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign"
> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const ButtonWithoutIcons = ({ children, ...props }: BaseButtonProps) => (
  <Button {...props} unstyled={true}>
    <YStack style={{ alignItems: "center", flex: 1 }}>
      {children}
    </YStack>
  </Button>
);

const ButtonWithLeftIcon = ({
  children,
  leftIcon,
  ...props
}: BaseButtonProps & Required<Pick<BaseButtonProps, "leftIcon">>) => {
  const [spacerWidth, setSpacerWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setSpacerWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <Button {...props} unstyled={true}>
      <XStack style={{ alignItems: "center", flex: 1 }}>
        <YStack style={{ padding: 8 }} onLayout={onLayout}>
          {leftIcon}
        </YStack>
        <YStack style={{ flex: 1, alignItems: "center" }}>
          {children}
        </YStack>
        <Spacer width={spacerWidth} />
      </XStack>
    </Button>
  );
};

const ButtonWithRightIcon = ({
  children,
  rightIcon,
  ...props
}: BaseButtonProps & Required<Pick<BaseButtonProps, "rightIcon">>) => {
  const [spacerWidth, setSpacerWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setSpacerWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <Button {...props} unstyled={true}>
      <XStack style={{ alignItems: "center", flex: 1 }}>
        <Spacer width={spacerWidth} />
        <YStack style={{ flex: 1, alignItems: "center" }}>
          {children}
        </YStack>
        <YStack style={{ padding: 8 }} onLayout={onLayout}>
          {rightIcon}
        </YStack>
      </XStack>
    </Button>
  );
};

const ButtonWithTwoIcons = ({
  children,
  rightIcon,
  leftIcon,
  ...props
}: BaseButtonProps &
  Required<Pick<BaseButtonProps, "leftIcon" | "rightIcon">>) => (
  <Button {...props} unstyled={true}>
    <XStack style={{ alignItems: "center", flex: 1 }}>
      <YStack style={{ padding: 8 }}>{leftIcon}</YStack>
      <YStack style={{ flex: 1, alignItems: "center" }}>{children}</YStack>
      <YStack style={{ padding: 8 }}>{rightIcon}</YStack>
    </XStack>
  </Button>
);

const BaseButton = ({
  children,
  leftIcon,
  rightIcon,
  ...props
}: BaseButtonProps) => {
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

export type { BaseButtonProps };
export { BaseButton };
