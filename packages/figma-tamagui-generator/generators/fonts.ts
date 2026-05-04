import type {
  FileVariable,
  FileVariablesResponse,
  FileNode,
  NumericToken,
  RawFontPrimitiveTokens,
  RemoteFontFace,
  RawFontTokens,
} from '../figma/types';

import { isNumber, isRGBA } from '../figma/types';
import { getVariablesFromFigmaFileId, getFileNodesById, getFileStyles } from '../figma/client';
import { filterVariables } from '../utils/common';

const FONT_DELIMITER = 'Typography/';
const PRIMITIVES_COLLECTION_NAME = '0 Primitives';
const PRODUCT_MODE_NAME = 'Product';

const getCollection = (
  variableCollections: FileVariablesResponse['meta']['variableCollections'],
  name: string,
) =>
  Object.values(variableCollections).find(
    (vc) => vc.name === name && !vc.hiddenFromPublishing,
  );

const getModeId = (
  collection: FileVariablesResponse['meta']['variableCollections'][string],
  modeName?: string,
): string | undefined =>
  modeName
    ? collection.modes.find((m) => m.name === modeName)?.modeId
    : collection.modes[0]?.modeId;

const fitlerByName = (variables: FileVariable[], delimiter: string) =>
  variables.filter((v) => v.name.includes(delimiter));

const sortNumericValues = (token: NumericToken): NumericToken =>
  Object.entries(token)
    .sort(([, a], [, b]) => a - b)
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {} as NumericToken);

const processNumericTokens = (
  fontVariables: FileVariable[],
  modeId: string,
  defaultValue: number,
): NumericToken => {
  const tokens: NumericToken = {};

  for (const fontVar of fontVariables) {
    let value = fontVar.valuesByMode[modeId];

    if (isNumber(value)) {
      tokens[fontVar.id] = value;
    } else {
      const related = fontVariables.find((cv) => {
        if (!isNumber(value) && !isRGBA(value) && typeof value !== 'string') {
          return cv.id === (value as { id: string }).id;
        }
        return false;
      });

      if (related) {
        value = Object.values(related.valuesByMode)[0];
        if (isNumber(value)) tokens[fontVar.id] = value;
      } else {
        console.error(
          `[figma-tamagui-generator] font variable "${fontVar.name}" reference not found. Defaulting to ${defaultValue}.`,
        );
        tokens[fontVar.id] = defaultValue;
      }
    }
  }

  return sortNumericValues(tokens);
};

const parseFontVariables = (
  modeId: string,
  fontVariables: FileVariable[],
): RawFontPrimitiveTokens => {
  const familyVars = fitlerByName(fontVariables, '/font/');
  const sizeVars = fitlerByName(fontVariables, '/size/');
  const lineHeightVars = fitlerByName(fontVariables, '/leading/');
  const weightVars = fitlerByName(fontVariables, '/weight/');
  const letterSpacingVars = fitlerByName(fontVariables, '/tracking/');

  const familyType: Record<string, string> = {};
  const family: Record<string, string> = {};

  for (const familyVar of familyVars) {
    const value = familyVar.valuesByMode[modeId];
    const familyTypeName = familyVar.name.replace(`${FONT_DELIMITER}font/`, '').trim();
    if (typeof value === 'string') {
      familyType[familyTypeName] = value;
      family[familyVar.id] = value;
    }
  }

  return {
    familyType,
    family,
    size: processNumericTokens(sizeVars, modeId, 14),
    lineHeight: processNumericTokens(lineHeightVars, modeId, 20),
    weight: processNumericTokens(weightVars, modeId, 400),
    letterSpacing: processNumericTokens(letterSpacingVars, modeId, 0),
  };
};

const generateFontsTokenFromVariables = (
  meta: FileVariablesResponse['meta'],
): RawFontPrimitiveTokens => {
  const fontVariables = filterVariables(Object.values(meta.variables), FONT_DELIMITER);

  const primitivesCollection = getCollection(meta.variableCollections, PRIMITIVES_COLLECTION_NAME);

  if (!primitivesCollection) {
    throw new Error(
      `[figma-tamagui-generator] No "${PRIMITIVES_COLLECTION_NAME}" collection found in Figma file.`,
    );
  }

  const modeId = getModeId(primitivesCollection, PRODUCT_MODE_NAME);

  if (!modeId) {
    throw new Error(
      `[figma-tamagui-generator] No "${PRODUCT_MODE_NAME}" mode found in "${PRIMITIVES_COLLECTION_NAME}" collection.`,
    );
  }

  return parseFontVariables(modeId, fontVariables);
};

const getRemoteFontFacesFromNodes = (fontNodes: FileNode[]): RemoteFontFace[] =>
  fontNodes.map((node) => {
    const vars = node.boundVariables;
    if (!vars) throw new Error(`[figma-tamagui-generator] Font node "${node.name}" has no bound variables.`);
    return {
      name: node.name,
      style: {
        fontFamily: vars.fontFamily[0].id,
        fontStyle: vars.fontWeight[0].id,
        fontSize: vars.fontSize[0].id,
        lineHeight: vars.lineHeight?.[0]?.id,
        letterSpacing: vars.letterSpacing?.[0]?.id,
      },
    };
  });

const generateFontTokensFromFigma = async (
  figmaFileId: string,
): Promise<RawFontTokens> => {
  const [variables, styles] = await Promise.all([
    getVariablesFromFigmaFileId(figmaFileId),
    getFileStyles(figmaFileId),
  ]);

  const fontNodeIds = styles
    .filter((s) => s.style_type === 'TEXT' && !s.name.startsWith('DS-'))
    .map((s) => s.node_id);

  const fontNodes = await getFileNodesById(figmaFileId, fontNodeIds);

  return {
    primitives: generateFontsTokenFromVariables(variables),
    remoteFonts: getRemoteFontFacesFromNodes(fontNodes),
  };
};

export {
  generateFontTokensFromFigma,
  generateFontsTokenFromVariables,
  getRemoteFontFacesFromNodes,
};
