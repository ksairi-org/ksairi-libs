import type {
  FileVariable,
  FileVariablesResponse,
  RawColorThemes,
  ValueByMode,
  VariableCollections,
  ComponentCollection,
} from '../figma/types';

import { isRGBA, hasRelationship } from '../figma/types';
import { getVariablesFromFigmaFileId } from '../figma/client';

const DEFAULT_COLOR = 'rgba(0,255,255,1)';

const getRGBAValues = (rgba: { r: number; g: number; b: number; a: number }) => {
  let { r, g, b, a } = rgba;
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  a = Number.isInteger(a) ? a : Number.parseFloat(a.toFixed(2));
  return `rgba(${r},${g},${b},${a})`;
};

const getRelatedColorValue = (
  colorVariables: FileVariable[],
  colorVariable: FileVariable,
  valuesByMode: ValueByMode,
): string => {
  if (isRGBA(valuesByMode)) return getRGBAValues(valuesByMode);

  if (!hasRelationship(valuesByMode)) {
    console.error(
      `[figma-tamagui-generator] ${colorVariable.name}: value is neither RGBA nor a reference. Defaulting to CYAN.`,
    );
    return DEFAULT_COLOR;
  }

  const related = colorVariables.find((cv) => cv.id === (valuesByMode as { id: string }).id);

  if (!related) {
    console.error(
      `[figma-tamagui-generator] ${colorVariable.name}: referenced variable not found. Defaulting to CYAN.`,
    );
    return DEFAULT_COLOR;
  }

  const nextValue = Object.values(related.valuesByMode)[0];
  if (isRGBA(nextValue)) return getRGBAValues(nextValue);

  return DEFAULT_COLOR;
};

const getCollectionModeSuffix = (
  componentsCollection: ComponentCollection[],
  variableCollectionId: string,
  modeId: string,
): string => {
  const component = componentsCollection.find((c) => c.id === variableCollectionId);
  const mode = component?.modes.find((m) => m.modeId === modeId);
  return mode ? `-${mode.name}` : '';
};

const isComponentMode = (componentsCollection: ComponentCollection[], modeId: string) =>
  componentsCollection.some((c) => c.modes.some((m) => m.modeId === modeId));

const getColorName = (name: string) =>
  name.trim().replace('Color/', '').replace(/\//g, '-').toLowerCase();

const getColorNameWithMode = (
  componentsCollection: ComponentCollection[],
  colorVariable: FileVariable,
  modeId: string,
) =>
  colorVariable.name
    .trim()
    .replace('Color/', '')
    .replace('/', '-')
    .concat(getCollectionModeSuffix(componentsCollection, colorVariable.variableCollectionId, modeId))
    .toLowerCase();

const resolveComponentColorThemes = (
  valueByMode: ValueByMode,
  colorVariables: FileVariable[],
  colorVariable: FileVariable,
  variableCollections: VariableCollections,
  modeId: string,
): RawColorThemes => {
  if (!hasRelationship(valueByMode)) {
    throw new Error(
      `[figma-tamagui-generator] Component color ${colorVariable.name} has no variable reference.`,
    );
  }

  const firstRef = colorVariables.find((cv) => cv.id === (valueByMode as { id: string }).id);

  if (!firstRef) {
    throw new Error(
      `[figma-tamagui-generator] Component color ${colorVariable.name}: reference ${(valueByMode as { id: string }).id} not found.`,
    );
  }

  return Object.keys(firstRef.valuesByMode).reduce((acc, modeKey) => {
    const groupName = variableCollections.colorsCollection[modeKey];
    const colorName = getColorNameWithMode(
      variableCollections.componentsCollection,
      colorVariable,
      modeId,
    );

    let colorValue = '';
    try {
      colorValue = getRelatedColorValue(
        colorVariables,
        colorVariable,
        firstRef.valuesByMode[modeKey],
      );
    } catch (e) {
      console.error(e);
    }

    if (!colorValue) return acc;

    if (groupName) {
      return { ...acc, [groupName]: { ...acc[groupName], [colorName]: colorValue } };
    }

    return Object.values(variableCollections.colorsCollection).reduce(
      (prev, key) => ({
        ...prev,
        [key]: { ...acc[key], ...prev[key], [colorName]: colorValue },
      }),
      acc,
    );
  }, {} as RawColorThemes);
};

const buildColorThemesFromVariables = (
  variableCollections: VariableCollections,
  colorVariables: FileVariable[],
): RawColorThemes => {
  const semanticVars = colorVariables.filter((v) => !v.hiddenFromPublishing);

  const allThemes = semanticVars.flatMap((colorVar) =>
    Object.keys(colorVar.valuesByMode).map((modeId) => {
      const valueByMode = colorVar.valuesByMode[modeId];

      if (isComponentMode(variableCollections.componentsCollection, modeId)) {
        return resolveComponentColorThemes(
          valueByMode,
          colorVariables,
          colorVar,
          variableCollections,
          modeId,
        );
      }

      const groupName = variableCollections.colorsCollection[modeId];
      const colorName = getColorName(colorVar.name);

      if (isRGBA(valueByMode)) {
        return { [groupName]: { [colorName]: getRGBAValues(valueByMode) } };
      }

      return {
        [groupName]: {
          [colorName]: getRelatedColorValue(colorVariables, colorVar, valueByMode),
        },
      };
    }),
  );

  return allThemes.reduce((merged, next) => {
    for (const group of Object.keys(next)) {
      merged[group] = { ...merged[group], ...next[group] };
    }
    return merged;
  }, {} as RawColorThemes);
};

const getColorVariableCollections = (
  variableCollections: FileVariablesResponse['meta']['variableCollections'],
): VariableCollections => {
  const COMPONENT_COLLECTION_NAMES = ['Component: Buttons'];
  const SYSTEM_COLORS_COLLECTION_NAME = 'System: Color';

  const componentsCollection = Object.values(variableCollections).filter(
    (vc) => COMPONENT_COLLECTION_NAMES.some((name) => vc.name.includes(name)),
  );

  const colorsCollection = Object.values(variableCollections)
    .filter((vc) => vc.name.includes(SYSTEM_COLORS_COLLECTION_NAME))
    .reduce(
      (prev, curr) => ({
        ...prev,
        ...curr.modes.reduce(
          (modes, mode) => ({ ...modes, [mode.modeId]: mode.name.toLowerCase() }),
          {},
        ),
      }),
      {} as Record<string, string>,
    );

  return { colorsCollection, componentsCollection };
};

const buildColorThemesFromFigma = async (
  figmaFileId: string,
): Promise<RawColorThemes> => {
  const meta = await getVariablesFromFigmaFileId(figmaFileId);

  const variableCollections = getColorVariableCollections(meta.variableCollections);

  const colorVariables = Object.values(meta.variables).filter(
    (v) => v.resolvedType === 'COLOR',
  );

  return buildColorThemesFromVariables(variableCollections, colorVariables);
};

export {
  buildColorThemesFromFigma,
  buildColorThemesFromVariables,
  getColorVariableCollections,
};
