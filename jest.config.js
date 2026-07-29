/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
    // Transform the ESM .js worker (export default) to CommonJS so handler-level
    // tests can require() it. Scoped to allowJs via an inline ts-jest tsconfig so
    // the production build (tsconfig.json) is untouched.
    '^.+\\.js$': [
      'ts-jest',
      {
        tsconfig: { allowJs: true, checkJs: false, module: 'commonjs', esModuleInterop: true },
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/universal-registry-worker.js',
    '!src/worker.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
