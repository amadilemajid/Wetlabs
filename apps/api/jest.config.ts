import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!src/reset-passwords.ts'],
  coverageThreshold: { global: { lines: 15, functions: 15, branches: 15 } },
  moduleNameMapper: {
    '^@wetlabs/shared-types$': '<rootDir>/../../packages/shared-types/src'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'
  ],
  setupFiles: ['<rootDir>/tests/setup.ts']
};
export default config;
