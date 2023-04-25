const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = 'eslint-rules/';

module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  root: true,
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-native',
    'rulesdir',
    'unused-imports',
  ],
  rules: {
    // eslint
    'no-console': [1, {allow: ['warn', 'error']}],
    'no-fallthrough': 2,

    'no-restricted-exports': [
      'error',
      {restrictDefaultExports: {direct: true}},
    ],

    'no-restricted-imports': ['warn', {patterns: ['@atb/components/*/']}],

    // React-Hooks Plugin
    // The following rules are made available via `eslint-plugin-react-hooks`
    'react-hooks/rules-of-hooks': 2, // early error

    // https://github.com/Intellicode/eslint-plugin-react-native
    // @TODO Fix this.
    // This has a bug: https://github.com/Intellicode/eslint-plugin-react-native/issues/270
    // 'react-native/no-raw-text': [2, {skip: ['ThemeText']}], // rather early error than JS bundle crash

    'react-native/no-single-element-style-arrays': 1,
    'react-native/no-unused-styles': 1,
    'unused-imports/no-unused-imports': 2,
    'unused-imports/no-unused-vars': [
      2,
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    'rulesdir/translations-warning': 'warn',
    'rulesdir/avoid-imports': [
      'warn',
      {
        '@react-navigation/core': '@react-navigation/native',
      },
    ],
    'rulesdir/import-warning': [
      'warn',
      {
        SafeAreaView: 'react-native-safe-area-context',
        TouchableOpacity: 'react-native',
      },
    ],
  },
  overrides: [
    {
      files: ['src/assets/svg/**', 'types/*', 'src/translations/**'],
      rules: {
        'no-restricted-exports': [
          'error',
          {restrictDefaultExports: {direct: false}},
        ],
      },
    },
  ],
};
