import typescriptEslint from "@typescript-eslint/eslint-plugin";
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

export default [{
    ignores: ["**/dist/", "**/lib/", "**/node_modules/"],
}, ...compat.extends("google"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 13,
        sourceType: "module",
    },

    rules: {
        "comma-dangle": ["error", {
            arrays: "only-multiline",
            objects: "only-multiline",
            imports: "only-multiline",
            exports: "only-multiline",
            functions: "never",
        }],

        indent: ["error", 2, {
            SwitchCase: 1,
        }],

        "require-jsdoc": 0,
        semi: 0,
    },
}];