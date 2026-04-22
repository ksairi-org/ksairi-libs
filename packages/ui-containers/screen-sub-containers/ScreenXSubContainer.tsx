import type { XStackProps } from 'tamagui';

import { XStack } from 'tamagui';

type ScreenSubXContainerProps = Omit<XStackProps, 'paddingHorizontal'>;

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @param props.backgroundColor container's background color
 * @returns JSX container containing its children
 */
const ScreenXSubContainer = ({
  children,
  ...props
}: ScreenSubXContainerProps) => (
  <XStack {...props} paddingHorizontal={'$md'}>
    {children}
  </XStack>
);

export { ScreenXSubContainer };
export type { ScreenSubXContainerProps };
