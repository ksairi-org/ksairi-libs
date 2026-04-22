import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "url";
import { tsquery } from "@phenomnomnominal/tsquery";
import { isPropertySignature, isTypeReferenceNode } from "typescript";
import { constantify } from "inflected";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(dirname(__filename));

const schemaFilePath = resolve(__dirname, "schema.ts");
const errorFilePath = resolve(__dirname, "errors.ts");

const contents = readFileSync(schemaFilePath, "utf-8");

const AST_ERROR_CODE_SELECTOR =
  "VariableDeclaration:has(Identifier[name=/ErrorCode$/]) PropertyAssignment";

const buildErrorCodes = (sourceCode) => {
  const queryResult = tsquery.query(sourceCode, AST_ERROR_CODE_SELECTOR);
  const errorCodes = new Set();

  const output = ["export const enum ErrorCode {"];

  queryResult.forEach((propertyAssignment) => {
    const code = propertyAssignment.name.getText();

    // Prevent duplicate entries.
    if (errorCodes.has(code)) {
      return;
    }

    output.push(`\t${constantify(code)} = '${code}',`);

    errorCodes.add(code);
  });

  output.push("}");

  return [output.join("\n"), errorCodes];
};

const buildErrorContexts = (sourceCode, errorNames) => {
  const queryResult = tsquery.query(
    sourceCode,
    "TypeAliasDeclaration:has(Identifier[name=/Context$/])",
  );

  const output = ["export type ErrorContext = {"];

  queryResult.forEach((typeAliasDeclaration) => {
    const code = typeAliasDeclaration.name.getText().replace(/Context$/i, "");

    // Prevent non-contextual errors.
    if (!errorCodes.has(code)) {
      return;
    }

    const errorEntry = `ErrorCode.${constantify(code)}`;
    const errorContext = [];

    typeAliasDeclaration.type.members.forEach((member) => {
      if (!isPropertySignature(member) || !isTypeReferenceNode(member.type)) {
        return;
      }

      const propertyName = member.name.getText();

      errorContext.push(`\t\t${propertyName}: ErrorContextValue;`);
    });

    output.push(`\t[${errorEntry}]: {\n${errorContext.join("\n")}\n\t};`);
  });

  output.push("}");

  return output.join("\n");
};

const getFileHeader = () => {
  const output = [
    "/**",
    " * This file is generated AUTOMATICALLY, please do not edit it!",
    " */",
    "",
    "export type ErrorContextValue = boolean | number | string",
  ];

  return output.join("\n");
};

const [errorEnum, errorCodes] = buildErrorCodes(contents);

const errorContext = buildErrorContexts(contents, errorCodes);

const fileHeader = getFileHeader();

writeFileSync(
  errorFilePath,
  [fileHeader, errorEnum, errorContext].join("\n\n"),
);
