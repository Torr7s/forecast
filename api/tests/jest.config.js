const path = require('node:path');

const root = path.resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig, ... {
    rootDir: root,
    displayName: 'e2e-tests',
    setupFilesAfterEnv: [
      '<rootDir>/tests/jest.setup.ts'
    ],
    testMatch: [
      '<rootDir>/tests/**/*.test.ts'
    ]
  }
};