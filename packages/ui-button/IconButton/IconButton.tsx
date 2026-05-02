import type { ButtonProps } from "tamagui";
import type { ReactNode } from "react";

import { Button } from "tamagui";

type IconButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign" | "fontWeight"
> & {
  icon: ReactNode;
};

const IconButton = ({ disabled, icon, pressStyle, ...props }: IconButtonProps) => (
  <Button
    unstyled={true}
    style={{ borderRadius: 9999, padding: 8 }}
    pressStyle={pressStyle ?? { opacity: 0.7 }}
    {...props}
    disabled={disabled}
  >
    {icon}
  </Button>
);

export { IconButton };
export type { IconButtonProps };
