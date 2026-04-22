import { useHasValueChanged } from './useHasValueChanged';

/**
 * @param value value of any kind
 * @param fn function to execute if value has changed
 */
const useRunFunctionOnChange = <Value, Fn extends () => unknown>(
  value: Value,
  fn: Fn,
) => {
  const hasValueChanged = useHasValueChanged(value);

  if (hasValueChanged) {
    fn();
  }
};

export { useRunFunctionOnChange };
