import { useState, useCallback } from "react";
import type { ComponentProps } from "react";

import { BaseTouchable } from "../BaseTouchable";

type ThrottledButtonProps = Omit<
  ComponentProps<typeof BaseTouchable>,
  "onPress"
> & {
  onPress?: () => void;
  throttleTime?: number;
};

const ThrottledButton = ({
  onPress,
  throttleTime = 350,
  ...props
}: ThrottledButtonProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      setIsDisabled(true);
      onPress?.();
      setTimeout(() => setIsDisabled(false), throttleTime);
    }
  }, [isDisabled, onPress, throttleTime]);

  return (
    <BaseTouchable onPress={handlePress} {...props}>
      {props.children}
    </BaseTouchable>
  );
};

export { ThrottledButton };
export type { ThrottledButtonProps };
