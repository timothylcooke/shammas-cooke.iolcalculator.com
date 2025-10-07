import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import stylisticEslintPlugin from "@stylistic/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
    ),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
        "@stylistic": stylisticEslintPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "@stylistic/indent": ["error", "tab"],
        "@stylistic/linebreak-style": ["error", "windows"],
        "@stylistic/quotes": ["error", "single"],
        "@stylistic/jsx-quotes": ["error", "prefer-double"],
        "@stylistic/semi": ["error", "always"],
        "react/react-in-jsx-scope": "off",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/no-multiple-empty-lines": ["error", {
            max: 1,
            maxBOF: 0,
            maxEOF: 0,
        }],
        "@stylistic/eol-last": ["error", "always"],
    },
}]);

