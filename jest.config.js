module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.jsx$": "babel-jest"
  },
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  modulePaths: [
    '<rootDir>/node_modules/',
    '<rootDir>/node_modules/meteor-jest-stubs/lib/',
  ],
  unmockedModulePathPatterns: [
    '/^imports\\/.*\\.jsx?$/',
    '/^node_modules/',
  ],
  modulePathIgnorePatterns: [
    ".meteor"
  ],
  "setupFilesAfterEnv": ["<rootDir>/tests/setupJest.js"],
};

