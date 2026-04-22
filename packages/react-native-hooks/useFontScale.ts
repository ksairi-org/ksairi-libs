import { useState, useEffect } from 'react';

import { PixelRatio, Dimensions } from 'react-native';

/**
 *
 * @returns The font scale of the device.
 */
const useFontScale = () => {
  const [fontScale, setFontScale] = useState(PixelRatio.getFontScale());

  useEffect(() => {
    const handleDimensionsChange = () => {
      setFontScale(PixelRatio.getFontScale());
    };

    const subscription = Dimensions.addEventListener(
      'change',
      handleDimensionsChange,
    );

    return subscription.remove;
  }, []);

  return fontScale;
};

export { useFontScale };
