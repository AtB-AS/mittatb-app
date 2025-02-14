module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  testRegex: '\\.test\\.tsx?$',
  moduleNameMapper: {
    '^@atb/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: './__tests__/test-setup.js',
  coverageThreshold: {
    './src/modules/purchase-selection/': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
