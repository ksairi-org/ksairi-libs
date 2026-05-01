import type { ColorTokens } from "tamagui";
import { ActivityIndicator, StyleSheet } from "react-native";

import type { GenericButtonProps } from "../GenericButton/GenericButton";
import { GenericButton } from "../GenericButton";

const pressedBackgroundColor: ColorTokens = "$button-background-active-cta";
const inactiveBackgroundColor: ColorTokens = "$button-background-inactive-cta";

const styles = StyleSheet.create({
  inactivePress: { backgroundColor: inactiveBackgroundColor },
  activePress: { backgroundColor: pressedBackgroundColor },
});

type CTAButtonProps = Omit<
  GenericButtonProps,
  "backgroundColor" | "pressStyle" | "color"
> & { loading?: boolean };

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
    backgroundColor={
      disabled ? inactiveBackgroundColor : "$button-background-default-cta"
    }
    pressStyle={disabled ? styles.inactivePress : styles.activePress}
    color={disabled ? "$text-inactive" : "$text-action"}
    width={width || "$full"}
    borderRadius={borderRadius || "$radius.xl"}
    padding={padding || "$md"}
  >
    {loading ? <ActivityIndicator size={"small"} /> : children}
  </GenericButton>
);

export { CTAButton };
export type { CTAButtonProps };
