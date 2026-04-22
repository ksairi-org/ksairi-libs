type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type WithId = { id: string };

type ValueByMode = RGBA | WithId | number | string;

type FileVariable = {
  id: string;
  name: string;
  resolvedType: string;
  valuesByMode: { [key: string]: ValueByMode };
  hiddenFromPublishing: boolean;
  variableCollectionId: string;
};

type VariableCollectionMode = {
  modeId: string;
  name: string;
};

type FileVariablesResponse = {
  meta: {
    variableCollections: {
      [key: string]: {
        id: string;
        name: string;
        modes: VariableCollectionMode[];
        hiddenFromPublishing: boolean;
      };
    };
    variables: { [key: string]: FileVariable };
  };
};

type FileStyle = {
  key: string;
  style_type: string;
  node_id: string;
  name: string;
};

type FileStylesResponse = FileStyle[];

type FigmaTextBoundVariables = {
  fontFamily: { type: string; id: string }[];
  fontWeight: { type: string; id: string }[];
  fontSize: { type: string; id: string }[];
  lineHeight: { type: string; id: string }[];
  letterSpacing: { type: string; id: string }[];
};

type FileNode = {
  id: string;
  name: string;
  type: string;
  boundVariables?: FigmaTextBoundVariables;
};

type ComponentCollection = {
  id: string;
  name: string;
  modes: VariableCollectionMode[];
};

type VariableCollections = {
  colorsCollection: { [systemColorsGroupModeId: string]: string };
  componentsCollection: ComponentCollection[];
};

type RawColorToken = { [key: string]: string };
type RawColorThemes = Record<string, RawColorToken>;
type RawSpaceToken = { [key: string]: number | string };
type RawRadiusToken = { [key: string]: number };

type StringToken = { [x: string]: string };
type NumericToken = { [x: string]: number };

type RawFontPrimitiveTokens = {
  familyType: StringToken;
  family: StringToken;
  size: NumericToken;
  lineHeight: NumericToken;
  weight: NumericToken;
  letterSpacing: NumericToken;
};

type FigmaTextBoundVariableIds = {
  fontFamily: string;
  fontStyle: string;
  fontSize: string;
  lineHeight?: string;
  letterSpacing?: string;
};

type RemoteFontFace = {
  name: string;
  style: FigmaTextBoundVariableIds;
};

type RawFontTokens = {
  primitives: RawFontPrimitiveTokens;
  remoteFonts: RemoteFontFace[];
};

function isNumber(v: ValueByMode): v is number {
  return typeof v === 'number' && !isNaN(v);
}

function hasRelationship(v: ValueByMode): v is WithId {
  if (isNumber(v)) return false;
  return !!(v as WithId).id;
}

function isRGBA(v: ValueByMode): v is RGBA {
  return !isNumber(v) && !hasRelationship(v) && typeof v !== 'string';
}

export type {
  RGBA,
  WithId,
  ValueByMode,
  FileVariable,
  VariableCollectionMode,
  FileVariablesResponse,
  FileStyle,
  FileStylesResponse,
  FigmaTextBoundVariables,
  FileNode,
  ComponentCollection,
  VariableCollections,
  RawColorToken,
  RawColorThemes,
  RawSpaceToken,
  RawRadiusToken,
  StringToken,
  NumericToken,
  RawFontPrimitiveTokens,
  FigmaTextBoundVariableIds,
  RemoteFontFace,
  RawFontTokens,
};
export { isNumber, hasRelationship, isRGBA };
