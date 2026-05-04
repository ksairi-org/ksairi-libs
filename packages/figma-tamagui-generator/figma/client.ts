import axios from 'axios';

import type {
  FileVariablesResponse,
  FileStylesResponse,
  FileNode,
} from './types';

const getFigmaAPI = () =>
  axios.create({
    baseURL: 'https://api.figma.com/v1/',
    timeout: 10000,
    headers: { 'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN },
  });

const getVariablesFromFigmaFileId = async (
  fileId: string,
): Promise<FileVariablesResponse['meta']> => {
  const { data } = await getFigmaAPI().get(`files/${fileId}/variables/local`);

  const filteredCollections = Object.entries(
    data.meta.variableCollections,
  ).filter(([, v]) => v.remote === false);

  const filteredVariables = Object.entries(data.meta.variables).filter(
    ([, v]) => v.remote === false,
  );

  return {
    variableCollections: Object.fromEntries(filteredCollections),
    variables: Object.fromEntries(filteredVariables),
  };
};

const getFileNodesById = async (
  fileId: string,
  nodeIds: string[],
): Promise<FileNode[]> => {
  const { data } = await getFigmaAPI().get(`files/${fileId}/nodes`, {
    params: { ids: nodeIds.join(',') },
  });

  return Object.values(
    data.nodes as { document: FileNode }[],
  ).map((node) => node.document);
};

const getFileStyles = async (fileId: string): Promise<FileStylesResponse> => {
  const { data } = await getFigmaAPI().get(`files/${fileId}/styles`);
  return data.meta.styles;
};

export { getVariablesFromFigmaFileId, getFileNodesById, getFileStyles };
