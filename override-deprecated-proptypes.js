const reactnative = require('react-native');

// TODO TEMPORARY DUE TO REACT NATIVE DEPS. SHOULD BE REMOVED
Object.defineProperty(reactnative, 'ColorPropType', {
  configurable: true,
  get() {
    return {};
  },
});

Object.defineProperty(reactnative, 'EdgeInsetsPropType', {
  configurable: true,
  get() {
    return {};
  },
});

Object.defineProperty(reactnative, 'PointPropType', {
  configurable: true,
  get() {
    return {};
  },
});

Object.defineProperty(reactnative, 'ViewPropTypes', {
  configurable: true,
  get() {
    return {};
  },
});
