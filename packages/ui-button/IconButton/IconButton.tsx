import type { ColorTokens, ButtonProps } from "tamagui";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { Button } from "tamagui";

type ButtonType = "basic" | "cta" | "brand";

type IconButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign" | "fontWeight"
> & {
  buttonType?: ButtonType;
  icon: ReactNode;
  iconColor?: ColorTokens;
};

type ButtonColorScheme = {
  default: ColorTokens;
  active: ColorTokens;
  inactive: ColorTokens;
};

const IconButton = ({
  buttonType = "basic",
  disabled,
  icon,
  ...props
}: IconButtonProps) => {
  const buttonColors = useMemo<ButtonColorScheme>(
    () => ({
      default: `$button-background-default-${buttonType}` as ColorTokens,
      active: `$button-background-active-${buttonType}` as ColorTokens,
      inactive: `$button-background-inactive-${buttonType}` as ColorTokens,
    }),
    [buttonType],
  );

  return (
    <Button
      unstyled={true}
      borderRadius={"$full"}
      backgroundColor={buttonColors.default}
      padding={"$sm"}
      pressStyle={{
        backgroundColor: disabled ? buttonColors.inactive : buttonColors.active,
      }}
      {...props}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
};

export { IconButton };
export type { IconButtonProps, ButtonType };
