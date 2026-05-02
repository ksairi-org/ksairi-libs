import { useColorTokenValue } from "@ksairi-org/react-native-ui-config";
import type { ColorTokens } from "tamagui";

import { View, getTokenValue } from "tamagui";

type CircleProps = {
  size: string;
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
      width: getTokenValue(size),
      height: getTokenValue(size),
      borderWidth: thickness,
      borderRadius: getTokenValue(size) / 2,
    }}
  />
);

export { Circle };
export type { CircleProps };
