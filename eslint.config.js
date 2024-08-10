const eslintPluginTypeScript = require('@typescript-eslint/eslint-plugin');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');
const eslintPluginReactNative = require('eslint-plugin-react-native');
const eslintPluginImport = require('eslint-plugin-import');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintParser = require('@typescript-eslint/parser');

module.exports = [
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
                    tabWidth: 4,
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
