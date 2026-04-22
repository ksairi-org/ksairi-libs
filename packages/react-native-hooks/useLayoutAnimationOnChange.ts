import { useHasValueChanged } from "@ksairi-org/react-hooks";
import { performLayoutAnimation } from "@ksairi-org/react-native-functions";

/**
 * @param value value to animate on change
 * @param skipAnimation if true, animation is omitted, default to false
 */
const useLayoutAnimationOnChange = <ValueType>(
  value: ValueType,
  skipAnimation = false,
) => {
  const hasValueChanged = useHasValueChanged(value);

  if (hasValueChanged) {
    performLayoutAnimation(skipAnimation);
  }
};

export { useLayoutAnimationOnChange };
