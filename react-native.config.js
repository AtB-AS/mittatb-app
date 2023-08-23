module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    ...(process.env.CI
      ? {'react-native-flipper': {platforms: {ios: null}}}
      : {}),
  },
};
