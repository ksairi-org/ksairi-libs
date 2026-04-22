import type { SomeRecord } from './types';

const typedKeys = Object.keys as <T extends SomeRecord>(
  o: T,
) => Extract<keyof T, string>[];

export { typedKeys };
