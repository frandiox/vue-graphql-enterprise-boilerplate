const _ = require('lodash')

// @ts-ignore
const { paths } = require('./jsconfig.json').compilerOptions
const aliasesMapper = Object.keys(paths).reduce(
  (acc, key) => ({
    ...acc,
    ['^' + key.replace('/*', '/(.*)') + '$']:
      '<rootDir>/' + paths[key][0].replace('/*', '/$1'),
  }),
  {}
)

module.exports = {
  setupFiles: ['<rootDir>/tests/unit/setup'],
  globalSetup: '<rootDir>/tests/unit/global-setup',
  globalTeardown: '<rootDir>/tests/unit/global-teardown',
  setupTestFrameworkScriptFile: '<rootDir>/tests/unit/matchers',
  testMatch: ['**/(*.)unit.js'],
  moduleFileExtensions: ['js', 'json', 'vue', 'gql', 'graphql'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  transformIgnorePatterns: ['/node_modules/(?!vue-cli-plugin-apollo).+\\.js$'],
  moduleNameMapper: {
    // Transform any static assets to empty strings
    '\\.(jpe?g|png|gif|webp|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)$':
      '<rootDir>/tests/unit/fixtures/empty-string.js',
    ...aliasesMapper,
  },
  snapshotSerializers: ['jest-serializer-vue'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    'server/**/*.js',
    '!**/node_modules/**',
    '!src/main.js',
    '!src/app.vue',
    '!src/router/index.js',
    '!src/router/routes.js',
    '!src/state/vue-apollo.js',
    '!src/components/globals/index.js',
    '!server/src/index.js',
    '!server/src/resolvers/**',
    '!server/src/**/_*.js',
  ],
  // https://facebook.github.io/jest/docs/en/configuration.html#testurl-string
  // Set the `testURL` to a provided base URL if one exists, or the mock API base URL
  // Solves: https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios
  testURL:
    process.env.API_BASE_URL || `http://localhost:${_.random(9000, 9999)}`,
}
