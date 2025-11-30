import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
  // Ignorer COMPLÈTEMENT les fichiers générés
  {
    ignores: [
      "**/generated/**",
      "**/prisma/**",
      "dist/**",
      "node_modules/**",
      "coverage/**",
    ],
  },

  // Configuration pour le code source TypeScript/JavaScript
  {
    files: ["**/*.js", "**/*.ts"],
    ignores: ["src/generated/**", "**/*.test.*", "**/*.spec.*"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-require-imports": "error",
      "no-empty": "warn",
    },
  },
];
