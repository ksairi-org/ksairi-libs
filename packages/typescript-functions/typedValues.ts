import type { SomeRecord } from './types';

const typedValues = Object.values as <T extends SomeRecord>(
  o: T,
) => T[keyof T][];

export { typedValues };
