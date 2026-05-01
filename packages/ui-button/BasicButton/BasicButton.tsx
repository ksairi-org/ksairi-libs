import type { GenericButtonProps } from "../GenericButton/GenericButton";
import { GenericButton } from "../GenericButton";

type BasicButtonProps = GenericButtonProps;

const BasicButton = ({ disabled, ...props }: BasicButtonProps) => (
  <GenericButton
    {...props}
    disabled={disabled}
    opacity={disabled ? 0.4 : props.opacity}
  />
);

export { BasicButton };
export type { BasicButtonProps };
