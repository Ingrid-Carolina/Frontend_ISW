import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';

export default defineConfig([
	{
		ignores: [
			'node_modules',
			'dist',
      'dist-ssr',
			'build',
			'coverage',
			'public',
			'**/*.test.*',
			'**/*.spec.*',
			'vite.config.js*',
			'*.config.js',
			'.*.js'
		],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
			globals: globals.browser,
		},
		plugins: {
			react: pluginReact,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			...js.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			...pluginReact.configs.flat.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react/jsx-no-target-blank': 'warn',
		},
	},
	prettier,
]);
