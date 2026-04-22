import type { YStackProps } from 'tamagui';

import { YStack } from 'tamagui';

type ScreenSubYContainerProps = Omit<YStackProps, 'paddingHorizontal'>;

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @param props.backgroundColor container's background color
 * @returns JSX container containing its children
 */
const ScreenYSubContainer = ({
  children,
  ...props
}: ScreenSubYContainerProps) => (
  <YStack {...props} paddingHorizontal={'$md'}>
    {children}
  </YStack>
);

export { ScreenYSubContainer };
export type { ScreenSubYContainerProps };
