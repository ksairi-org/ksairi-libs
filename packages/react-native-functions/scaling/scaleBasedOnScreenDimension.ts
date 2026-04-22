import { Dimensions } from 'react-native';

import { isWeb } from '@tamagui/constants';

/**
 *
 * @param initialValue Value to scale, likely coming from Figma designs
 * @param baseProportionValueFromDesigns The base value from the designs to scale from; defaults to 393, which is the width of the iPhone 15 Pro
 * @returns The scaled value based on the screen dimensions
 */
const scaleBasedOnScreenDimension = (
  initialValue: number,
  // 393 is iPhone 15 Pro width
  baseProportionValueFromDesigns = 393,
) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

  if (isWeb) {
    return initialValue;
  }

  const dimensionToUse =
    screenWidth > screenHeight ? screenHeight : screenWidth;

  const proportionOfDesign = dimensionToUse / baseProportionValueFromDesigns;

  return initialValue * proportionOfDesign;
};

export { scaleBasedOnScreenDimension };
