import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { styled, XStackProps } from "tamagui";

type ScreenXGlassSubContainerProps = GlassViewProps & XStackProps;

const StyledGlassView = styled(GlassView);

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @returns JSX container containing its children
 */
const ScreenXGlassSubContainer = ({
  children,
  ...props
}: ScreenXGlassSubContainerProps) => (
  <StyledGlassView {...props} flexDirection="row">
    {children}
  </StyledGlassView>
);

export { ScreenXGlassSubContainer };
