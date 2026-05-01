import { ActivityIndicator } from "react-native";

import type { GenericButtonProps } from "../GenericButton/GenericButton";
import { GenericButton } from "../GenericButton";

type CTAButtonProps = GenericButtonProps & { loading?: boolean };

const CTAButton = ({
  children,
  disabled,
  loading,
  width,
  borderRadius,
  padding,
  ...props
}: CTAButtonProps) => (
  <GenericButton
    {...props}
    disabled={disabled}
    opacity={disabled ? 0.4 : props.opacity}
    width={width ?? "$full"}
    borderRadius={borderRadius ?? "$radius.xl"}
    padding={padding ?? "$md"}
  >
    {loading ? <ActivityIndicator size={"small"} /> : children}
  </GenericButton>
);

export { CTAButton };
export type { CTAButtonProps };
