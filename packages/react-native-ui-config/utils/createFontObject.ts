type KeyOfFontsObject = number | "true";

const DEFAULT_VALUE_FOR_TRUE = 16;

const findValueClosestToNumber = (array: number[], numberToFind: number) => {
  if (array.length === 0) {
    return DEFAULT_VALUE_FOR_TRUE;
  }

  let closestNumber = array[0];
  let smallestDifference = Math.abs(array[0] - numberToFind);

  for (const num of array) {
    const difference = Math.abs(num - numberToFind);

    if (difference < smallestDifference) {
      smallestDifference = difference;

      closestNumber = num;
    }
  }

  return closestNumber;
};

const createFontKeys = (length: number): KeyOfFontsObject[] => [
  ...Array.from({ length }).map((_, index) => index + 1),
  "true",
];

/**
 * @param array font keys
 * @param values values for font keys
 * @returns fonts key/value array
 */
const createObjectFromArray = <
  ArrayValue extends KeyOfFontsObject,
  ArrayType extends ArrayValue[],
>(
  array: ArrayType,
  values: number[],
) =>
  array.reduce(
    (acc, nextKey, currentIndex) => {
      const nextValue =
        nextKey !== "true"
          ? values[currentIndex]
          : // @ts-ignore
            findValueClosestToNumber(values, DEFAULT_VALUE_FOR_TRUE);

      // @ts-ignore
      acc[nextKey] = nextValue;

      return acc;
    },
    {} as Record<ArrayType[number], number>,
  );

/**
 * @param values custom fonts values
 * @returns fonts key/value array
 */
const createFontObject = (values: number[]): Record<KeyOfFontsObject, number> =>
  createObjectFromArray(createFontKeys(values.length), values);

export { createFontObject };
