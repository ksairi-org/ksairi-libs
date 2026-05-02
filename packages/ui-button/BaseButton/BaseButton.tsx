import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";

import { Button, type ButtonProps, Spacer } from "tamagui";

type BaseButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign"
> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const ButtonWithoutIcons = ({ children, ...props }: BaseButtonProps) => (
  <Button {...props} unstyled={true}>
    <View style={{ alignItems: "center", flex: 1 }}>
      {children}
    </View>
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
      <View style={{ alignItems: "center", flexDirection: "row", flex: 1 }}>
        <View style={{ padding: 8 }} onLayout={onLayout}>
          {leftIcon}
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {children}
        </View>
        <Spacer width={spacerWidth} />
      </View>
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
      <View style={{ alignItems: "center", flexDirection: "row", flex: 1 }}>
        <Spacer width={spacerWidth} />
        <View style={{ flex: 1, alignItems: "center" }}>
          {children}
        </View>
        <View style={{ padding: 8 }} onLayout={onLayout}>
          {rightIcon}
        </View>
      </View>
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
    <View style={{ alignItems: "center", flexDirection: "row", flex: 1 }}>
      <View style={{ padding: 8 }}>{leftIcon}</View>
      <View style={{ flex: 1, alignItems: "center" }}>{children}</View>
      <View style={{ padding: 8 }}>{rightIcon}</View>
    </View>
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
