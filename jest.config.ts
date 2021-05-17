export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/tests/coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'ts'
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],

  setupFiles: [
    '<rootDir>/jest.setup.ts'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
}
