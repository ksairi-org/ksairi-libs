import type { FileVariable } from '../figma/types';

const getDefaultValue = (
  tokens: Record<string, number | string>,
): number | string => {
  const values = Object.values(tokens).filter(
    (v): v is number => typeof v === 'number',
  );

  if (values.length === 0) return 16;

  return values.reduce((prev, curr) =>
    Math.abs(curr - 16) < Math.abs(prev - 16) ? curr : prev,
  );
};

const filterVariables = (
  fileVariables: FileVariable[],
  delimiter: string,
): FileVariable[] =>
  fileVariables.filter((v) => v.name.includes(delimiter));

const findModeId = (
  variableCollections: Record<string, { modes: { modeId: string; name: string }[] }>,
  modeName: string,
): string | undefined => {
  for (const collection of Object.values(variableCollections)) {
    const mode = collection.modes.find((m) => m.name === modeName);
    if (mode) return mode.modeId;
  }
  return undefined;
};

export { getDefaultValue, filterVariables, findModeId };
