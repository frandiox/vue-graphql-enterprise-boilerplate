const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const appConfig = require('./src/app.config')

// @ts-ignore
const { paths } = require('./jsconfig.json').compilerOptions
const alias = Object.keys(paths).reduce(
  (acc, key) => ({
    ...acc,
    [key.replace('/*', '')]: path.join(
      __dirname,
      paths[key][0].replace('/*', '')
    ),
  }),
  {}
)

module.exports = {
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: appConfig.title,
    // Set up all the aliases we use in our app.
    resolve: {
      alias,
      extensions: ['/index.vue', '.gql', '.graphql'],
    },
    plugins: [
      // Optionally produce a bundle analysis
      // TODO: Remove once this feature is built into Vue CLI
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.ANALYZE ? 'static' : 'disabled',
        openAnalyzer: process.env.CI !== 'true',
      }),
    ],
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
  },
}
