import { Spinner, type ColorTokens } from "tamagui";

import type { BaseButtonProps } from "../BaseButton/BaseButton";
import { BaseButton } from "../BaseButton";

type CTAButtonProps = BaseButtonProps & {
  loading?: boolean;
  spinnerColor?: ColorTokens;
};

const CTAButton = ({
  children,
  disabled,
  loading,
  spinnerColor,
  width,
  borderRadius,
  padding,
  ...props
}: CTAButtonProps) => (
  <BaseButton
    {...props}
    disabled={disabled}
    opacity={disabled ? 0.4 : props.opacity}
    width={width ?? "$full"}
    borderRadius={borderRadius ?? "$radius.xl"}
    padding={padding ?? "$md"}
  >
    {loading ? <Spinner color={spinnerColor} /> : children}
  </BaseButton>
);

export { CTAButton };
export type { CTAButtonProps };
