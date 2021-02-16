module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.js', '.json', '.tsx', '.ts'],
        alias: {
          '@atb': './src',
        },
      },
    ],
  ],
};
