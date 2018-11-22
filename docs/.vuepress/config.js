const appConfig = require('../../src/app.config')

module.exports = {
  title: appConfig.title + ' Docs',
  description: appConfig.description,
  themeConfig: {
    sidebar: [
      ['/', 'Introduction'],
      '/development',
      '/architecture',
      '/techfront',
      '/routing',
      '/techback',
      '/backend',
      '/auth',
      '/state',
      '/tests',
      '/linting',
      '/editors',
      '/production',
      '/troubleshooting',
    ],
  },
  configureWebpack: config => {
    config.module.noParse = [
      config.module.noParse,
      /\/server\/node_modules/, // Ignore server's node_modules
    ]
  },
}
