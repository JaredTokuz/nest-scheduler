module.exports = {
  displayName: 'scheduler',
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts','js'],
  coverageDirectory: '<rootDir>/coverage',
};
