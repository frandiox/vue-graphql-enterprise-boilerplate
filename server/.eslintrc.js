module.exports = {
  root: false,
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: '2018',
  },
  extends: [
    // https://github.com/mysticatea/eslint-plugin-node
    'plugin:node/recommended',
  ],
  rules: {
    'node/no-unpublished-require': 'off',
  },
}
