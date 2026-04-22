import type { GetProps } from "tamagui";

import { styled, ThemeableStack } from "tamagui";
import { useAutoHitSlop } from "@react-native-hooks";
import { ComponentRef } from "react";

const StyledBaseTouchable = styled(ThemeableStack, {
  hoverTheme: true,
  pressTheme: false,
  focusTheme: false,
  pressStyle: {
    opacity: 0.7,
  },
});

type TouchableProps = GetProps<typeof ThemeableStack> & {
  ref?: React.Ref<ComponentRef<typeof ThemeableStack>>;
};

const BaseTouchableWithAutoHitSlop = (props: TouchableProps) => {
  const [hitSlop, onLayout] = useAutoHitSlop(props.onLayout);

  return (
    <StyledBaseTouchable
      {...props}
      hitSlop={hitSlop}
      onLayout={onLayout}
      ref={props.ref}
    >
      {props.children}
    </StyledBaseTouchable>
  );
};

/**
 *
 * @param props component props
 * @param props.children touchable children
 * @returns ThemeableStack with or without hitSlop support
 */
const BaseTouchable = (props: TouchableProps) => {
  if (props.hitSlop) {
    // If `hitSlop` manually is added, respect it
    return (
      <StyledBaseTouchable {...props} ref={props.ref}>
        {props.children}
      </StyledBaseTouchable>
    );
  }

  // Otherwise, add `hitSlop` automatically
  return <BaseTouchableWithAutoHitSlop {...props} ref={props.ref} />;
};

export { BaseTouchable };
export type { TouchableProps };
