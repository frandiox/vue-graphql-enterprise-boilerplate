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

const common = {
  transformIgnorePatterns: ['/node_modules/(?!vue-cli-plugin-apollo).+\\.js$'],
  moduleFileExtensions: ['js', 'json', 'vue', 'gql', 'graphql'],
  moduleNameMapper: {
    // Transform any static assets to empty strings
    '\\.(jpe?g|png|gif|webp|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)$':
      '<rootDir>/tests/unit/fixtures/empty-string.js',
    ...aliasesMapper,
  },
}

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      setupFiles: ['<rootDir>/tests/unit/setup'],
      setupTestFrameworkScriptFile: '<rootDir>/tests/unit/matchers',
      testMatch: ['<rootDir>/src/**/(*.)unit.js'],
      snapshotSerializers: ['jest-serializer-vue'],
      transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.js$': 'babel-jest',
        '\\.(gql|graphql)$': 'jest-transform-graphql',
      },
      globals: {
        'vue-jest': {
          // Compilation errors in the <style> tags of Vue components will
          // already result in failing builds, so compiling CSS during unit
          // tests doesn't protect us from anything. It only complicates
          // and slows down our unit tests.
          experimentalCSSCompile: false,
        },
      },
    },
    {
      ...common,
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/src/**/(*.)unit.js'],
      setupFiles: [],
      transformIgnorePatterns: [
        '/node_modules/(?!apollo-datasource|apollo-server-errors)',
      ],
    },
  ],
  globalSetup: '<rootDir>/tests/unit/global-setup',
  globalTeardown: '<rootDir>/tests/unit/global-teardown',
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
}
