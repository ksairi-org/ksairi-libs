import { Spinner, type ColorTokens } from "tamagui";

import type { BaseButtonProps } from "../BaseButton/BaseButton";
import { BaseButton } from "../BaseButton";

type CTAButtonProps = BaseButtonProps & {
  loading?: boolean;
  spinnerColor?: ColorTokens;
  borderRadius?: number | string;
  padding?: number | string;
};

const CTAButton = ({
  children,
  disabled,
  loading,
  spinnerColor,
  width,
  borderRadius,
  padding,
  style,
  ...props
}: CTAButtonProps) => (
  <BaseButton
    {...props}
    disabled={disabled}
    opacity={disabled ? 0.4 : props.opacity}
    width={width}
    style={[
      { borderRadius: borderRadius ?? 16, padding: padding ?? 12 },
      width === undefined ? { width: "100%" } : null,
      style,
    ]}
  >
    {loading ? <Spinner color={spinnerColor} /> : children}
  </BaseButton>
);

export { CTAButton };
export type { CTAButtonProps };
