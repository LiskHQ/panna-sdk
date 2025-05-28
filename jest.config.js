module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^flow-sdk(.*)$': '<rootDir>/packages/flow-sdk/src$1'
  }
};
