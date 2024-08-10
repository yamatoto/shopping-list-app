import { fileURLToPath } from 'url';
import path from 'path';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactNative from 'eslint-plugin-react-native';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        ignores: ['node_modules', 'build'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: eslintParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTypeScript,
            react: eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            'react-native': eslintPluginReactNative,
            import: eslintPluginImport,
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    semi: true,
                    singleQuote: true,
                    tabWidth: 4, // PrettierのtabWidthをここに適用
                },
            ],
            'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                },
            ],
            'react-native/no-inline-styles': 'off',
            'react-native/no-unused-styles': 'off',
            'react-native/split-platform-components': 'error',
        },
    },
];
