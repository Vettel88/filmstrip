module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.less$': 'jest-raw-loader'
  },
  moduleNameMapper: {
    '^/imports/(.*)': '<rootDir>/imports/$1',
    '^meteor/(.*)': '<rootDir>/__mocks__/meteor/$1.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  moduleFileExtensions: ['js', 'jsx'],
  modulePaths: ['<rootDir>/node_modules/'],
  unmockedModulePathPatterns: ['/^node_modules/'],
  modulePathIgnorePatterns: ['.meteor'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.js']
}
