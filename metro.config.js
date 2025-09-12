const path = require('path');
const withStorybook = require('@storybook/react-native/metro/withStorybook');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
let config = {};

config = mergeConfig(defaultConfig, config);
config = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;
