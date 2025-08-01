module.exports = {
  preset: 'ts-jest',
  projects: [
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      testMatch: ['**/src/react/**/*.test.{ts,tsx}'],
      collectCoverageFrom: ['src/react/**/*.{ts,tsx}', '!src/react/**/*.d.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: {
              jsx: 'react-jsx',
              esModuleInterop: true
            }
          }
        ]
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/react/$1',
        '^src/(.*)$': '<rootDir>/src/$1'
      },
      testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
      }
    },
    {
      displayName: 'core',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['**/src/core/**/*.test.ts'],
      collectCoverageFrom: ['src/core/**/*.{ts}', '!src/core/**/*.d.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: {
              esModuleInterop: true
            }
          }
        ]
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
      }
    }
  ],
  testTimeout: 10000,
  detectOpenHandles: true,
  testEnvironmentOptions: {
    teardown: 100
  }
};
