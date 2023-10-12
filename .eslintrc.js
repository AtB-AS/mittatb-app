const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = 'eslint-rules/';

const noRestrictedImportsPatterns = [
  {
    group: ['@atb/components/*/'],
    message: 'Components should be imported through their index file',
  },
];

module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
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
  ],
  rules: {

    // Warning on console.log
    'no-console': [1, {allow: ['warn', 'error']}],

    // Error on fallthrough in switch statements
    'no-fallthrough': 2,

    // Error on 'export default'
    'no-restricted-exports': [
      'error',
      {restrictDefaultExports: {direct: true}},
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

    // Error on raw text that is not inside Text or ThemeText
    'react-native/no-raw-text': [2, {skip: ['ThemeText']}],

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
      files: ['src/assets/svg/**', 'types/*', 'src/translations/**'],
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
      files: ['!src/stacks-hierarchy/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              ...noRestrictedImportsPatterns,
              {
                group: ['@atb/stacks-hierarchy/**'],
                message:
                  'Not allowed to import stuff from stacks-hierarchy from the outside. An exception may be made for ScreenParams types, and you can disable the eslint check for those imports.',
              },
            ],
          },
        ],
      },
    },
  ],

  /*
   Possible future improvements:
    - Exchaustive deps!!!
    - Not allow var
    - Not allow let that isn't reassigned
    - Not use brackets when specifying strings: E.g. `foo="bar"` instead of `foo={'bar'}`
    - Force imports from index files also from other modules than just the components folder
    - Not allow cyclic dependencies
    - Not allow crisscross importing inside stacks-hierarchy
    - Look into if able to give error on inline component creation during render
    - Shared eslint-settings that can be reused in our repos
   */

};
