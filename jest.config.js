module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.js',
    '<rootDir>/tests/integration/**/*.spec.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/helpers/styleMock.js',
    '\\.(pdf)$': '<rootDir>/tests/helpers/fileMock.js'
  },
  transformIgnorePatterns: ['/node_modules/(?!countup\\.js/)']
}
