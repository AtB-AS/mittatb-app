module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@atb/(.*)$': '<rootDir>/src/$1',
  },
};
