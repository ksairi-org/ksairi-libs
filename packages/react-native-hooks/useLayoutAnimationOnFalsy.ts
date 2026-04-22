import { useHasValueBecomeFalsy } from "@react-hooks";
import { performLayoutAnimation } from "@react-native-functions";

/**
 * @param value value to animate when becomes falsy
 * @param skipAnimation if true, animation is omitted, default to false
 */
const useLayoutAnimationOnFalsy = <ValueType>(
  value: ValueType,
  skipAnimation = false,
) => {
  const valueJustBecameFalsy = useHasValueBecomeFalsy(value);

  if (valueJustBecameFalsy) {
    performLayoutAnimation(skipAnimation);
  }
};

export { useLayoutAnimationOnFalsy };
