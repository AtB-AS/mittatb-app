module.exports = {
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
      },
    ],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
