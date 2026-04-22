import { defineConfig } from "orval";
import { scriptsFolder } from "./constants";

const infiniteQueryOperationNames: string[] = []; // input function names that need to support infinite querying

const operationOverrides = infiniteQueryOperationNames.reduce(
  (a, b) => ({
    ...a,
    [b]: {
      query: {
        useQuery: true,
        useInfinite: true,
        useInfiniteQueryParam: "nextCursor",
      },
    },
  }),
  {},
);

if (typeof process.env.EXPO_PUBLIC_SERVER_URL !== "string") {
  throw new Error("EXPO_PUBLIC_SERVER_URL is not defined in the process");
}

export default defineConfig({
  "react-sdk": {
    input: "./specs/open-api-spec.json",
    hooks: {
      afterAllFilesWrite: [
        `node ${__dirname}/${scriptsFolder}/adjust-responses.mjs`,
        `node ${__dirname}/${scriptsFolder}/adjust-errors.mjs`,
      ],
    },
    output: {
      target: "./schema.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "./custom-axios.ts",
          name: "customAxios",
        },
        operations: operationOverrides,
      },
    },
  },
});
