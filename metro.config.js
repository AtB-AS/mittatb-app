const path = require('path');
const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
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
let config = {
  resolver: {
    // Metro's package-exports resolver over-applies the exports map to
    // internal relative imports, breaking packages like date-fns whose
    // locale.js does `export * from "./locale/de.js"` while the exports
    // map only declares `./locale/de` (no `.js`, no wildcard).
    unstable_enablePackageExports: false,
  },
};

config = mergeConfig(defaultConfig, config);
config = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;
