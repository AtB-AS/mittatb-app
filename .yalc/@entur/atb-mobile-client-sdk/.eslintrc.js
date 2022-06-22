const { join } = require('path')
const exampleClientPackageJson = require('./example-client/package.json')

function parseVersion(version) {
    return version.replace(/[\^~]/g, '')
}

module.exports = {
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    env: {
        es6: true,
        node: true,
    },
    rules: {
        'arrow-body-style': 'off',
        'array-callback-return': ['error', { allowImplicit: true }],
        camelcase: [
            'error',
            { properties: 'never', ignoreDestructuring: false, allow: ['bicycle_rent'] },
        ],
        curly: ['error', 'multi-line'],
        'no-console': 'warn',
        'prefer-const': 'warn',
        'prefer-destructuring': 'off',
        'prefer-object-spread': 'error',
        semi: 'off',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: 'module',
                project: join(__dirname, 'tsconfig.eslint.json'),
                extraFileExtensions: ['.json'],
            },
            plugins: ['@typescript-eslint'],
            rules: {
                '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
                '@typescript-eslint/no-shadow': 'error',
                '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
                'no-shadow': 'off',
                'no-unused-vars': 'off',
            },
        },
        {
            files: ['*.tsx'],
            extends: ['plugin:react/recommended'],
            plugins: ['react', 'react-hooks', 'react-native'],
            settings: {
                react: {
                    version: parseVersion(exampleClientPackageJson.dependencies.react),
                },
            },
            rules: {
                'react/no-typos': 'off',
                'react/no-unused-state': 'error',
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'error',
                'react-native/no-single-element-style-arrays': 'error',
                'react-native/no-unused-styles': 'error',
                'react-native/sort-styles': 'error',
            },
        },
    ],
}
