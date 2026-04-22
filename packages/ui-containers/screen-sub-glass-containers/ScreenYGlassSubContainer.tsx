import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { styled, YStackProps } from "tamagui";

type ScreenYGlassSubContainerProps = GlassViewProps & YStackProps;

const StyledGlassView = styled(GlassView);

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @returns JSX container containing its children
 */
const ScreenYGlassSubContainer = ({
  children,
  ...props
}: ScreenYGlassSubContainerProps) => (
  <StyledGlassView {...props} flexDirection="column">
    {children}
  </StyledGlassView>
);

export { ScreenYGlassSubContainer };
