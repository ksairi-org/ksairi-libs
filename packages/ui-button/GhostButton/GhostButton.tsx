import type { BaseButtonProps } from "../BaseButton/BaseButton";
import { BaseButton } from "../BaseButton";

type GhostButtonProps = BaseButtonProps;

const GhostButton = ({ disabled, ...props }: GhostButtonProps) => (
  <BaseButton
    {...props}
    disabled={disabled}
    opacity={disabled ? 0.4 : props.opacity}
  />
);

export { GhostButton };
export type { GhostButtonProps };
