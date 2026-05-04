import tseslint from "typescript-eslint";

const TYPE_CHECKED_PACKAGES = [
  "packages/typescript-functions/**/*.ts",
  "packages/react-hooks/**/*.ts",
  "packages/react-hooks/**/*.tsx",
  "packages/ui-button/**/*.ts",
  "packages/ui-button/**/*.tsx",
  "packages/ui-button-animated/**/*.ts",
  "packages/ui-button-animated/**/*.tsx",
  "packages/ui-touchables/**/*.ts",
  "packages/ui-touchables/**/*.tsx",
  "packages/ui-action-buttons/**/*.ts",
  "packages/ui-action-buttons/**/*.tsx",
  "packages/ui-containers/**/*.ts",
  "packages/ui-containers/**/*.tsx",
  "packages/react-native-functions/**/*.ts",
  "packages/react-native-ui-config/**/*.ts",
  "packages/react-native-ui-config/**/*.tsx",
];

export default tseslint.config(
  // Recommended rules for all TS files (no type info required)
  {
    files: ["packages/**/*.ts", "packages/**/*.tsx"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
  },
  // Additional type-aware rules for packages covered by tsconfig.json
  {
    files: TYPE_CHECKED_PACKAGES,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "eslint.config.js",
      "packages/react-query-sdk/schema.ts",
      "packages/react-query-sdk/**/*.js",
      "packages/react-query-sdk/**/*.mjs",
    ],
  },
);
