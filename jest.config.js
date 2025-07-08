module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^panna-sdk(.*)$': '<rootDir>/packages/panna-sdk/src$1'
  }
};
