import { config } from "@aha-co/config/eslint"
import { globalIgnores } from "eslint/config"
import globals from "globals"

/** @type {import("eslint").Linter.Config[]} */
export default [
	...config,
	globalIgnores([
		"dist",
		"packages",
		"src/contracts/*",
		"!src/contracts/util.ts",
	]),
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ["./tsconfig.node.json", "./tsconfig.app.json"],
				tsconfigRoot: import.meta.dirname,
			},
		},
	},
]
