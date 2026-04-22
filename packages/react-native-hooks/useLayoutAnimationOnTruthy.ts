import { useHasValueBecomeTruthy } from "@react-hooks";
import { performLayoutAnimation } from "@react-native-functions";

/**
 * @param value value to animate when becomes truthy
 * @param skipAnimation if true, animation is omitted, default to false
 */
const useLayoutAnimationOnTruthy = <ValueType>(
  value: ValueType,
  skipAnimation = false,
) => {
  const valueJustBecameTruthy = useHasValueBecomeTruthy(value);

  if (valueJustBecameTruthy) {
    performLayoutAnimation(skipAnimation);
  }
};

export { useLayoutAnimationOnTruthy };
