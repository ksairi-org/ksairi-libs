import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tsquery } from "@phenomnomnominal/tsquery";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(dirname(__filename));

const schemaFilePath = resolve(__dirname, "schema.ts");
const contents = readFileSync(schemaFilePath, "utf-8");

const AST_SELECTOR = "TypeAliasDeclaration:has(Identifier[name=/AllOf/])";
const ERRORED_API_RESPONSE_PROPS = [
  "data",
  "status",
  "code",
  "error",
  "statusCode",
];

const adjustedContents = tsquery.replace(contents, AST_SELECTOR, (node) =>
  ERRORED_API_RESPONSE_PROPS.reduce(
    (text, prop) => text.replace(`${prop}?:`, `${prop}:`),
    node.getText(),
  ),
);

writeFileSync(schemaFilePath, adjustedContents);
