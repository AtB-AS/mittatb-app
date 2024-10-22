const {getDefaultConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

config.resolver.resolverMainFields.unshift("sbmodern");
//config.transformer.unstable_allowRequireContext = true

module.exports = config;
