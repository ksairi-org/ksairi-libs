import type { FileVariable, RawRadiusToken } from '../figma/types';

import { isNumber, isRGBA } from '../figma/types';
import { getVariablesFromFigmaFileId } from '../figma/client';
import { getDefaultValue, filterVariables, findModeId } from '../utils/common';

const RADIUS_DELIMITER = 'rounded-';
const DEFAULT_RADIUS_VALUE = 18;

const getRadiusVariables = (
  fileVariables: FileVariable[],
  delimiter = RADIUS_DELIMITER,
): FileVariable[] => filterVariables(fileVariables, delimiter);

const parseRadiusVariables = (
  mobileModeId: string,
  radiusVariables: FileVariable[],
  allVariables: FileVariable[],
): RawRadiusToken => {
  let radiusToken: RawRadiusToken = {};

  for (const radiusVar of radiusVariables) {
    const name = radiusVar.name
      .trim()
      .substring(radiusVar.name.indexOf('/') + 1)
      .replace(RADIUS_DELIMITER, '')
      .toLowerCase();

    let mobileValue = radiusVar.valuesByMode[mobileModeId];

    if (isNumber(mobileValue)) {
      radiusToken[name] = mobileValue;
    } else {
      const related = allVariables.find((cv) => {
        if (!isNumber(mobileValue) && !isRGBA(mobileValue) && typeof mobileValue !== 'string') {
          return cv.id === (mobileValue as { id: string }).id;
        }
        return false;
      });

      if (related) {
        mobileValue = Object.values(related.valuesByMode)[0];
        if (isNumber(mobileValue)) {
          radiusToken[name] = mobileValue;
        }
      } else {
        console.error(
          `[figma-tamagui-generator] radius variable "${radiusVar.name}" reference not found. Defaulting to ${DEFAULT_RADIUS_VALUE}.`,
        );
        radiusToken[name] = DEFAULT_RADIUS_VALUE;
      }
    }
  }

  radiusToken = Object.entries(radiusToken)
    .sort(([, a], [, b]) => a - b)
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {} as RawRadiusToken);

  const defaultValue = getDefaultValue(radiusToken);

  if (typeof defaultValue !== 'number') {
    throw new Error('[figma-tamagui-generator] Radius tokens must all be numeric values.');
  }

  radiusToken.true = defaultValue;

  return radiusToken;
};

const buildRadiusFromFigma = async (
  figmaFileId: string,
  mobileModeName = 'Mobile',
): Promise<RawRadiusToken> => {
  const meta = await getVariablesFromFigmaFileId(figmaFileId);
  const allVariables = Object.values(meta.variables);

  const mobileModeId = findModeId(meta.variableCollections, mobileModeName);

  if (!mobileModeId) {
    throw new Error(
      `[figma-tamagui-generator] Mode "${mobileModeName}" not found in any variable collection.`,
    );
  }

  const radiusVariables = getRadiusVariables(allVariables);

  return parseRadiusVariables(mobileModeId, radiusVariables, allVariables);
};

export { buildRadiusFromFigma, getRadiusVariables, parseRadiusVariables };
