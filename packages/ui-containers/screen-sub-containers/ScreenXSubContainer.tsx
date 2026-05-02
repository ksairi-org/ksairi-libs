import type { XStackProps } from 'tamagui';

import { XStack } from 'tamagui';

type ScreenSubXContainerProps = XStackProps & {
  horizontalPadding?: number;
};

const ScreenXSubContainer = ({
  children,
  horizontalPadding = 16,
  ...props
}: ScreenSubXContainerProps) => (
  <XStack style={{ paddingHorizontal: horizontalPadding }} {...props}>
    {children}
  </XStack>
);

export { ScreenXSubContainer };
export type { ScreenSubXContainerProps };
