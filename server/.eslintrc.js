module.exports = {
  root: false,
  parserOptions: {
    sourceType: 'script',
  },
  extends: [
    // https://github.com/mysticatea/eslint-plugin-node
    'plugin:node/recommended',
  ],
  rules: {
    'node/no-unpublished-require': 'off',
  },
  overrides: [
    {
      // For any SSR vue component
      files: ['**/*.vue'],
      rules: {
        'node/no-unsupported-features': 'off',
      },
      parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
      },
      env: {
        browser: true,
      },
    },
  ],
}
