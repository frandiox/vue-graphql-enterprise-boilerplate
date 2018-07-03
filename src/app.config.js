// App-specific config

// Using CommonJS instead of ES2015+ export, because we also need to
// provide this object to Webpack in vue.config.js.
module.exports = {
  title: 'Vue GraphQL Enterprise Boilerplate',
  description:
    'Opinionated boilerplate project for an enterprise Vue frontend + GraphQL server',
}
