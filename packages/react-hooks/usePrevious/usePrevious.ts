import { useRef } from 'react';

/**
 * @param value value of any kind
 * @returns previous value of parameter
 */
const usePrevious = <ValueType>(value: ValueType) => {
  const ref = useRef(value);

  const previousValue = ref.current;

  ref.current = value;

  return previousValue;
};

export { usePrevious };
