const fs = require("fs");
const path = require("path");
const {
  specsFolder,
  functionsOpenApiSpecFileName,
} = require("../constants.js");

const parentDirname = path.dirname(__dirname);

/**
 * Generate OpenAPI spec from Functions directory
 * Scans supabase/functions directory for function definitions
 */
const parseFunctions = () => {
  const functionsDir = path.join(process.cwd(), "supabase", "functions");

  if (!fs.existsSync(functionsDir)) {
    console.warn(
      "supabase/functions directory not found. Creating empty spec.",
    );
    return createEmptySpec();
  }

  const baseSpec = {
    openapi: "3.0.0",
    info: {
      title: "Functions API",
      version: "1.0.0",
      description: "Auto-generated Functions API specification",
    },
    servers: [
      {
        url: "/",
        description: "Functions endpoint",
      },
    ],
    paths: {},
  };

  // Read all function directories
  const functionDirs = fs
    .readdirSync(functionsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const functionName of functionDirs) {
    const functionPath = path.join(functionsDir, functionName);
    const indexPath = path.join(functionPath, "index.ts");

    if (!fs.existsSync(indexPath)) {
      console.warn(`No index.ts found in ${functionName}, skipping...`);
      continue;
    }

    try {
      const functionContent = fs.readFileSync(indexPath, "utf8");
      const functionSpec = parseFunction(functionName, functionContent);

      if (functionSpec) {
        baseSpec.paths[`/${functionName}`] = functionSpec;
      }
    } catch (error) {
      console.error(
        `Error processing function ${functionName}:`,
        error.message,
      );
    }
  }

  return baseSpec;
};

/**
 * Parse Edge Function file and extract API specification
 * Looks for JSDoc comments with @param, @returns, @summary tags
 */
const parseFunction = (functionName, content) => {
  // Look for JSDoc comment blocks
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  const jsdocMatches = [...content.matchAll(jsdocRegex)];

  // Default function specification
  let functionSpec = {
    post: {
      operationId: `invoke${toPascalCase(functionName)}`,
      tags: ["edge-functions"],
      summary: `Invoke ${functionName} function`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {},
              additionalProperties: true,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  };

  // Parse JSDoc if available
  if (jsdocMatches.length > 0) {
    const jsdoc = jsdocMatches[0][1];

    // Extract summary
    const summaryMatch = jsdoc.match(/@summary\s+(.+)/);
    if (summaryMatch) {
      functionSpec.post.summary = summaryMatch[1].trim();
    }

    // Extract description
    const descMatch = jsdoc.match(/\*\s*([^@\n]+)/);
    if (descMatch) {
      functionSpec.post.description = descMatch[1].trim();
    }

    // Extract request body schema from @param tags
    const paramMatches = [
      ...jsdoc.matchAll(/@param\s+\{([^}]+)\}\s+(\w+)\s*-?\s*(.+)?/g),
    ];
    if (paramMatches.length > 0) {
      const properties = {};
      const required = [];

      for (const [, type, name, description] of paramMatches) {
        properties[name] = {
          type: convertTypeToOpenAPI(type.trim()),
          ...(description && { description: description.trim() }),
        };

        // Assume all params are required unless marked optional
        if (!type.includes("?") && !description?.includes("optional")) {
          required.push(name);
        }
      }

      functionSpec.post.requestBody.content["application/json"].schema = {
        type: "object",
        properties,
        ...(required.length > 0 && { required }),
      };
    }

    // Extract response schema from @returns tag
    const returnsMatch = jsdoc.match(/@returns?\s+\{([^}]+)\}\s*(.+)?/);
    if (returnsMatch) {
      const [, type, description] = returnsMatch;
      functionSpec.post.responses["200"] = {
        description: description?.trim() || "Success",
        content: {
          "application/json": {
            schema: parseTypeToSchema(type.trim()),
          },
        },
      };
    }
  }

  // Try to infer types from TypeScript interfaces/types in the file
  const interfaceMatches = [
    ...content.matchAll(/interface\s+(\w+Request)\s*\{([\s\S]*?)\}/g),
  ];
  if (interfaceMatches.length > 0) {
    for (const [, interfaceName, interfaceBody] of interfaceMatches) {
      if (interfaceName.toLowerCase().includes("request")) {
        const schema = parseInterfaceToSchema(interfaceBody);
        if (Object.keys(schema.properties).length > 0) {
          functionSpec.post.requestBody.content["application/json"].schema =
            schema;
        }
      }
    }
  }

  return functionSpec;
};

/**
 * Convert TypeScript/JSDoc type to OpenAPI type
 */
const convertTypeToOpenAPI = (type) => {
  const typeMap = {
    string: "string",
    number: "number",
    boolean: "boolean",
    object: "object",
    array: "array",
    Date: "string",
    any: "object",
  };

  return typeMap[type] || "string";
};

/**
 * Parse TypeScript interface to OpenAPI schema
 */
const parseInterfaceToSchema = (interfaceBody) => {
  const schema = {
    type: "object",
    properties: {},
    required: [],
  };

  // Simple regex to extract property definitions
  const propertyRegex = /(\w+)(\?)?:\s*([^;,\n]+)/g;
  const matches = [...interfaceBody.matchAll(propertyRegex)];

  for (const [, propertyName, optional, propertyType] of matches) {
    schema.properties[propertyName] = {
      type: convertTypeToOpenAPI(propertyType.trim()),
    };

    if (!optional) {
      schema.required.push(propertyName);
    }
  }

  return schema;
};

/**
 * Parse complex type definitions to schema
 */
const parseTypeToSchema = (type) => {
  if (type.startsWith("{") && type.endsWith("}")) {
    // Object type like { message: string, count: number }
    return { type: "object", additionalProperties: true };
  }

  if (type.includes("[]")) {
    // Array type
    return {
      type: "array",
      items: { type: convertTypeToOpenAPI(type.replace("[]", "")) },
    };
  }

  return { type: convertTypeToOpenAPI(type) };
};

/**
 * Convert kebab-case to PascalCase
 */
const toPascalCase = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

/**
 * Create empty spec when no functions directory exists
 */
const createEmptySpec = () => {
  return {
    openapi: "3.0.0",
    info: {
      title: "Functions API",
      version: "1.0.0",
      description: "Functions API specification",
    },
    servers: [
      {
        url: "/",
        description: "Functions endpoint",
      },
    ],
    paths: {},
  };
};

const generateFunctionsOpenApiSpec = () => {
  try {
    console.log("Generating Functions OpenAPI spec...");
    const spec = parseFunctions();

    // Write to file
    fs.writeFileSync(
      path.join(parentDirname, specsFolder, functionsOpenApiSpecFileName),
      JSON.stringify(spec, null, 2),
    );
    console.log(
      `✅ Generated spec with ${Object.keys(spec.paths).length} functions`,
    );

    // Log found functions
    Object.keys(spec.paths).forEach((path) => {
      console.log(`   - ${path}`);
    });
  } catch (error) {
    console.error("❌ Error generating spec:", error.message);
    process.exit(1);
  }
};

module.exports = { generateFunctionsOpenApiSpec };
