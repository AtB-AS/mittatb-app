const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = 'eslint-rules/';

const restrictedImportComponents = {
  group: ['@atb/components/*/', '@atb/modules/*/'],
  message: 'Not allowed to import without going through their index file',
};
const restrictedImportAuth = {
  group: ['@react-native-firebase/auth'],
  message: 'Not allowed to import Firebase Auth outside the auth module',
};
const restrictedImportStacksHierarchy = {
  group: ['@atb/stacks-hierarchy/**'],
  message:
    'Not allowed to import stuff from stacks-hierarchy from the outside. An exception may be made for ScreenParams types, and you can disable the eslint check for those imports.',
};

const notPattern = (toRemove) => (pattern) => pattern !== toRemove;

const noRestrictedImportsPatterns = [
  restrictedImportComponents,
  restrictedImportAuth,
  restrictedImportStacksHierarchy,
];

module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js'],
  root: true,
  extends: [
    // Add the recommended react-query eslint rules, with exhaustive deps for the query key
    'plugin:@tanstack/eslint-plugin-query/recommended',
    // Add the default prettier eslint rules, respecting the settings in .prettierrc.js
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'rulesdir',
    'unused-imports',
    '@tanstack/query',
    'jsx-no-leaked-values',
    'import',
  ],
  rules: {
    // Warning on console.log
    'no-console': [1, {allow: ['warn', 'error']}],

    // Error on fallthrough in switch statements
    'no-fallthrough': 2,

    // Error on using var, e.g. 'var name = "John"'
    'no-var': 2,

    // Error on using let for variable declaration that could be const
    'prefer-const': 2,

    // Error on 'export default'
    'no-restricted-exports': [
      'error',
      {restrictDefaultExports: {direct: true}},
    ],

    'import/extensions': [
      'error',
      'never',
      {android: 'always', ios: 'always', json: 'always'},
    ],

    // Error on imports not done through index files (as of now only applied for @atb/components)
    'no-restricted-imports': ['error', {patterns: noRestrictedImportsPatterns}],

    // Error on wildcard imports like 'import * as Utils from ...'
    'no-restricted-syntax': [
      'error',
      {
        selector: ":matches(ImportNamespaceSpecifier[local.name!='React'])",
        message: 'No wildcard imports',
      },
    ],

    // Error on components without children with closing tag
    'react/self-closing-comp': 2,

    // Error on:
    // - hooks outside of React components and custom hooks
    // - hooks inside loops, conditions, or nested functions
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': [2, {additionalHooks: '(useInterval)'}],

    // Error on raw text that is not inside Text or ThemeText
    'react-native/no-raw-text': [2, {skip: ['ThemeText']}],

    // Error on using curly braces for strings, e.g. field={'whatever'}
    'react/jsx-curly-brace-presence': [2, 'never'],

    // Warning on arrays with single elements in style prop, as the array is recreated on every render
    'react-native/no-single-element-style-arrays': 1,

    // Error on unused imports
    'unused-imports/no-unused-imports': 2,

    // Error on unused variables, except those starting with underscore
    'unused-imports/no-unused-vars': [
      2,
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Avoid accidentally rendering 0 or NaN, which makes react-native crash if rendered not inside Text component
    'jsx-no-leaked-values/jsx-no-leaked-values': 'error',

    // Warning on usage of texts from translations module without using the translation function
    'rulesdir/translations-warning': 'warn',

    // Warning on specific imports, with suggestion which imports to use instead
    'rulesdir/avoid-imports': [
      'warn',
      {
        '@react-navigation/core': '@react-navigation/native',
      },
    ],

    // Warning on given components imported from anywhere else than the specified import paths
    'rulesdir/import-warning': [
      'warn',
      {
        SafeAreaView: 'react-native-safe-area-context',
        TouchableOpacity: 'react-native',
      },
    ],
  },
  overrides: [
    // Allow 'export default' from these paths
    {
      files: [
        'src/assets/svg/**',
        'types/*',
        'src/translations/**',
        'src/storybook/stories/**',
      ],
      rules: {
        'no-restricted-exports': [
          'error',
          {restrictDefaultExports: {direct: false}},
        ],
      },
    },
    // Allow 'import * as …' in these paths, to not give errors on gql fragments
    {
      files: ['src/api/types/**'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    // Error on imports from stacks-hierarchy from paths outside of stacks-hierarchy
    {
      files: ['src/auth/**', 'src/setup.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: noRestrictedImportsPatterns.filter(
              notPattern(restrictedImportAuth),
            ),
          },
        ],
      },
    },
    {
      files: ['src/stacks-hierarchy/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: noRestrictedImportsPatterns.filter(
              notPattern(restrictedImportStacksHierarchy),
            ),
          },
        ],
      },
    },
    // Not enforce self-closing brackets on svg assets
    {
      files: ['src/assets/svg/**'],
      rules: {
        'react/self-closing-comp': 0,
      },
    },
  ],

  /*
   Possible future improvements:
    - Exchaustive deps!!!
    - Force imports from index files also from other modules than just the components folder
    - Not allow cyclic dependencies
    - Not allow crisscross importing inside stacks-hierarchy
    - Look into if able to give error on inline component creation during render
    - Shared eslint-settings that can be reused in our repos
   */
};
