module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [
    "<rootDir>/lib/",
    "<rootDir>/tests/"
  ],
  testMatch: ["**/tests/**/*.test.ts"],
  moduleDirectories: [
    "node_modules"
  ],
  "testPathIgnorePatterns": ["node_modules"],
  "collectCoverage": true
};