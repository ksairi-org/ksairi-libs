import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import type { LayoutChangeEvent } from "react-native";

import { Button, type ButtonProps, Spacer, XStack, YStack, styled } from "tamagui";

type BaseButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign"
> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const CenteredYStack = styled(YStack, {
  alignItems: "center",
  flex: 1,
});

const CenteredXStack = styled(XStack, {
  alignItems: "center",
  flex: 1,
});

const IconWrapper = styled(YStack, {
  padding: 8,
});

const ButtonWithoutIcons = ({ children, ...props }: BaseButtonProps) => (
  <Button {...props} unstyled={true}>
    <CenteredYStack>
      {children}
    </CenteredYStack>
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
      <CenteredXStack>
        <IconWrapper onLayout={onLayout}>
          {leftIcon}
        </IconWrapper>
        <CenteredYStack>
          {children}
        </CenteredYStack>
        <Spacer width={spacerWidth} />
      </CenteredXStack>
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
      <CenteredXStack>
        <Spacer width={spacerWidth} />
        <CenteredYStack>
          {children}
        </CenteredYStack>
        <IconWrapper onLayout={onLayout}>
          {rightIcon}
        </IconWrapper>
      </CenteredXStack>
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
    <CenteredXStack>
      <IconWrapper>{leftIcon}</IconWrapper>
      <CenteredYStack>{children}</CenteredYStack>
      <IconWrapper>{rightIcon}</IconWrapper>
    </CenteredXStack>
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
