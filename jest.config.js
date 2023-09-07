module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  testRegex: '\\.test\\.tsx?$',
  moduleNameMapper: {
    '^@atb/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: './__tests__/test-setup.js',
};
