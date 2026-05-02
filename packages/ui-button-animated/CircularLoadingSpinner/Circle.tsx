import { useColorTokenValue } from "@ksairi-org/react-native-ui-config";
import type { ColorTokens } from "tamagui";

import { View } from "tamagui";

type CircleProps = {
  size: number;
  thickness?: number;
  backgroundColor: ColorTokens;
  spinningPieceColor: ColorTokens;
};

const Circle = ({
  size,
  thickness,
  backgroundColor,
  spinningPieceColor,
}: CircleProps) => (
  <View
    style={{
      borderColor: useColorTokenValue(backgroundColor),
      borderTopColor: useColorTokenValue(spinningPieceColor),
      width: size,
      height: size,
      borderWidth: thickness,
      borderRadius: size / 2,
    }}
  />
);

export { Circle };
export type { CircleProps };
