import type { SomeRecord } from './types';

const typedEntries = Object.entries as <T extends SomeRecord>(
  o: T,
) => [keyof T, T[keyof T]][];

export { typedEntries };
