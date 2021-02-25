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
  extends: ['plugin:prettier/recommended', 'prettier/react'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'react-native', 'rulesdir'],
  rules: {
    // eslint
    'no-console': [1, {allow: ['warn', 'error']}],
    'no-fallthrough': 2,

    // React-Hooks Plugin
    // The following rules are made available via `eslint-plugin-react-hooks`
    'react-hooks/rules-of-hooks': 2, // early error

    // https://github.com/Intellicode/eslint-plugin-react-native
    'react-native/no-raw-text': [2, {skip: 'ThemeText'}], // rather early error than JS bundle crash
    'react-native/no-single-element-style-arrays': 1,
    'react-native/no-unused-styles': 1,

    'rulesdir/translations-warning': 'warn',
  },
};
