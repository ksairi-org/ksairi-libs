import { scaleBasedOnScreenDimension } from './scaleBasedOnScreenDimension';

/**
 *
 * @param root0 The option provided to potentially auto-scale the image based on the screen dimensions
 * @param root0.width The width of the image
 * @param root0.height The height of the image
 * @param root0.autoScaleBasedOnScreenDimensions Should the image be scaled based on the screen dimensions
 * @param root0.defaultSize The default size to use if the width and height are not provided
 * @param root0.maxFontScaleToApply The maximum font scale to apply
 * @param root0.fontScale The current font scale
 * @returns The width and height of the image, possibly scaled based on the screen dimensions
 */
const getImageDimensions = ({
  width,
  height,
  autoScaleBasedOnScreenDimensions,
  defaultSize,
  maxFontScaleToApply,
  fontScale,
}: {
  width?: number;
  height?: number;
  maxFontScaleToApply?: number;
  autoScaleBasedOnScreenDimensions?: boolean;
  defaultSize: number;
  fontScale: number;
}) => {
  const calculatedWidth = width ?? height ?? defaultSize;
  const calculatedHeight = height ?? width ?? width ?? defaultSize;

  const fontScaleToApply =
    typeof maxFontScaleToApply === 'number' && maxFontScaleToApply < fontScale
      ? maxFontScaleToApply
      : fontScale;

  const maybeScaledWidth = autoScaleBasedOnScreenDimensions
    ? scaleBasedOnScreenDimension(calculatedWidth)
    : calculatedWidth;

  const maybeScaledHeight = autoScaleBasedOnScreenDimensions
    ? scaleBasedOnScreenDimension(calculatedHeight)
    : calculatedHeight;

  return {
    width: maybeScaledWidth * fontScaleToApply,
    height: maybeScaledHeight * fontScaleToApply,
  };
};

export { getImageDimensions };
