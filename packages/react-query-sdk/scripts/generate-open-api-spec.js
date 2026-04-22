const fs = require("fs");
const axios = require("axios");
const {
  functionsUrlSuffix,
  specsFolder,
  openApiSpecFileName,
  functionsOpenApiSpecFileName,
} = require("../constants.js");
const path = require("path");

const {
  generateFunctionsOpenApiSpec,
} = require("./generate-functions-open-api-spec.js");

const parentDirname = path.dirname(__dirname);

const generateOpenApiSpec = async () => {
  const apiKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;

  if (!process.env.EXPO_PUBLIC_OPEN_API_SERVER_URL || !apiKey) {
    console.error(
      "❌ Missing required environment variables: EXPO_PUBLIC_OPEN_API_SERVER_URL and EXPO_PUBLIC_SUPABASE_API_KEY",
    );
    process.exit(1);
  }

  try {
    console.log("🔄 Downloading OpenAPI spec...");

    const response = await axios.get(
      process.env.EXPO_PUBLIC_OPEN_API_SERVER_URL,
      {
        headers: {
          apikey: apiKey,
          Accept: "application/json",
        },
        timeout: 30000,
      },
    );
    // Ensure the response is valid JSON
    if (typeof response !== "object" || response?.status !== 200) {
      throw new Error("Invalid OpenAPI specification received");
    }

    const dbOpenApiSpec = JSON.parse(JSON.stringify(response.data, null, 2));

    generateFunctionsOpenApiSpec();

    const functionsOpenApiSpec = JSON.parse(
      fs.readFileSync(
        path.join(parentDirname, specsFolder, functionsOpenApiSpecFileName),
        "utf8",
      ),
    );
    // Combine paths - prefix edge function paths to avoid conflicts
    const combinedPaths = {
      ...dbOpenApiSpec.paths,
    };

    // Add function paths with a prefix to distinguish them
    Object.entries(functionsOpenApiSpec.paths).forEach(([path, methods]) => {
      combinedPaths[`${functionsUrlSuffix}${path}`] = methods;
    });

    // Create combined spec
    const combinedSpec = {
      ...dbOpenApiSpec,
      paths: combinedPaths,
      // Merge tags if they exist
      tags: [
        ...(dbOpenApiSpec.tags || []),
        ...(functionsOpenApiSpec.tags || []),
      ],
    };

    const openApiSpecPath = path.join(
      parentDirname,
      specsFolder,
      openApiSpecFileName,
    );
    fs.writeFileSync(openApiSpecPath, JSON.stringify(combinedSpec, null, 2));

    console.log("✅ OpenAPI spec downloaded successfully");
    console.log(`📁 Saved to: ${openApiSpecPath}`);
  } catch (error) {
    console.error(error);
    console.error("❌ Failed to download spec:");
    process.exit(1);
  }
};

generateOpenApiSpec();
