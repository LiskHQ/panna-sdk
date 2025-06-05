module.exports = {
  preset: 'ts-jest',
  projects: [
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src', '<rootDir>/__tests__'],
      testMatch: [
        '**/__tests__/ui/**/*.test.{ts,tsx}',
        '**/src/ui/**/*.test.{ts,tsx}'
      ],
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
      roots: ['<rootDir>/src', '<rootDir>/__tests__'],
      testMatch: [
        '**/__tests__/core/**/*.test.{ts,tsx}',
        '**/src/core/**/*.test.{ts,tsx}'
      ],
      collectCoverageFrom: ['src/core/**/*.{ts,tsx}', '!src/core/**/*.d.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
      }
    }
  ]
};
