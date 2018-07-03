const appConfig = require('../src/app.config')

module.exports = {
  title: appConfig.title + ' Docs',
  description: appConfig.description,
  themeConfig: {
    sidebar: [
      ['/', 'Introduction'],
      '/docs/development',
      '/docs/architecture',
      '/docs/techfront',
      '/docs/routing',
      '/docs/techback',
      '/docs/backend',
      '/docs/state',
      '/docs/tests',
      '/docs/linting',
      '/docs/editors',
      '/docs/production',
      '/docs/troubleshooting',
    ],
  },
  configureWebpack: config => {
    config.module.noParse = [
      config.module.noParse,
      /\/server\/node_modules/, // Ignore server's node_modules
    ]
  },
}
