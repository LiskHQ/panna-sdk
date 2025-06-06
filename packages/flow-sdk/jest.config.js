module.exports = {
  preset: 'ts-jest',
  projects: [
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      testMatch: ['**/src/ui/**/*.test.{ts,tsx}'],
      collectCoverageFrom: ['src/ui/**/*.{ts,tsx}', '!src/ui/**/*.d.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
      },
      testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
      }
    },
    {
      displayName: 'core',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['**/src/core/**/*.test.{ts}'],
      collectCoverageFrom: ['src/core/**/*.{ts}', '!src/core/**/*.d.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
      }
    }
  ]
};
