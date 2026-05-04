import type { FileVariable, RawSpaceToken } from '../figma/types';

import { isNumber, isRGBA } from '../figma/types';
import { getVariablesFromFigmaFileId } from '../figma/client';
import { getDefaultValue, findModeId } from '../utils/common';

const SPACE_DELIMITER = 'space-';
const DEFAULT_SIZE_VALUE = 300;

const getSpacingVariables = (
  fileVariables: FileVariable[],
  delimiter = SPACE_DELIMITER,
): FileVariable[] =>
  fileVariables.filter((v) => v.name.includes(delimiter));

const parseSpacingVariables = (
  mobileModeId: string,
  spacingVariables: FileVariable[],
  allVariables: FileVariable[],
): RawSpaceToken => {
  const spacingToken: RawSpaceToken = {};

  for (const spacingVar of spacingVariables) {
    const name = spacingVar.name
      .trim()
      .substring(spacingVar.name.indexOf('/') + 1)
      .replace(SPACE_DELIMITER, '')
      .toLowerCase();

    const mobileValue = spacingVar.valuesByMode[mobileModeId];

    if (isNumber(mobileValue)) {
      spacingToken[name] = mobileValue;
    } else {
      const related = allVariables.find((cv) => {
        if (!isNumber(mobileValue) && !isRGBA(mobileValue) && typeof mobileValue !== 'string') {
          return cv.id === (mobileValue as { id: string }).id;
        }
        return false;
      });

      if (related) {
        const resolvedValue = Object.values(related.valuesByMode)[0];
        if (isNumber(resolvedValue) || resolvedValue === '100%') {
          spacingToken[name] = resolvedValue;
        }
      } else {
        console.error(
          `[figma-tamagui-generator] spacing variable "${spacingVar.name}" reference not found. Defaulting to ${DEFAULT_SIZE_VALUE}.`,
        );
        spacingToken[name] = DEFAULT_SIZE_VALUE;
      }
    }
  }

  spacingToken.true = getDefaultValue(spacingToken);

  return spacingToken;
};

const buildSpacingFromFigma = async (
  figmaFileId: string,
  mobileModeName = 'Mobile',
): Promise<RawSpaceToken> => {
  const meta = await getVariablesFromFigmaFileId(figmaFileId);
  const allVariables = Object.values(meta.variables);

  const mobileModeId = findModeId(meta.variableCollections, mobileModeName);

  if (!mobileModeId) {
    throw new Error(
      `[figma-tamagui-generator] Mode "${mobileModeName}" not found in any variable collection.`,
    );
  }

  const spacingVariables = getSpacingVariables(allVariables);

  return parseSpacingVariables(mobileModeId, spacingVariables, allVariables);
};

export { buildSpacingFromFigma, getSpacingVariables, parseSpacingVariables };
