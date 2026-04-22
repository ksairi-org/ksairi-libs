import { LayoutAnimation } from "react-native";

let isAnimating = false;

/**
 * reset isAnimating variable to false
 */
const resetIsAnimating = () => {
  isAnimating = false;
};

/**
 * @param skipAnimation if true, animation will be skipped, default to false
 */
const performLayoutAnimation = (skipAnimation = false) => {
  if (isAnimating) {
    console.log(
      "%ccalling performLayoutAnimation but already have one queued up or in progress",
      "color:red",
    );

    return;
  }

  if (!skipAnimation) {
    console.log("%ccalling performLayoutAnimation", "color:yellow");

    isAnimating = true;

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut,
      resetIsAnimating,
    );
  }
};

export { performLayoutAnimation };
