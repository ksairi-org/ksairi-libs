import { usePrevious } from './usePrevious';

/**
 * @param value boolean value
 * @returns if value provided has changed
 */
const useHasValueChanged = <ValueType>(value: ValueType) => {
  const prevValue = usePrevious(value);

  return prevValue !== value;
};

export { useHasValueChanged };
