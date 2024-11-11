const path = require('path');
const withStorybook = require('@storybook/react-native/metro/withStorybook');
const {getDefaultConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig, {
  // set to false to disable storybook specific settings
  // you can use a env variable to toggle this
  enabled: true,
  // path to your storybook config folder
  configPath: path.resolve(__dirname, './.storybook'),
});
