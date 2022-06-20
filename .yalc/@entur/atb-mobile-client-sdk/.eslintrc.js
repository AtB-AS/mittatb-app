const { join } = require('path')
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
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: 'module',
                project: join(__dirname, 'tsconfig.eslint.json'),
                extraFileExtensions: ['.json'],
            },
            plugins: ['@typescript-eslint'],
            env: {
                es6: true,
                node: true,
            },
            rules: {
                'no-console': 'warn',
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
            },
        },
    ],
}
