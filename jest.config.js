module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
    testMatch: [
        '**/tests/**/*.spec.ts',
    ]
};