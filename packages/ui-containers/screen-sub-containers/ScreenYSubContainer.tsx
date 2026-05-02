import type { YStackProps } from 'tamagui';

import { YStack } from 'tamagui';

type ScreenSubYContainerProps = YStackProps & {
  horizontalPadding?: number;
};

const ScreenYSubContainer = ({
  children,
  horizontalPadding = 16,
  ...props
}: ScreenSubYContainerProps) => (
  <YStack style={{ paddingHorizontal: horizontalPadding }} {...props}>
    {children}
  </YStack>
);

export { ScreenYSubContainer };
export type { ScreenSubYContainerProps };
