module.exports = {
  root: false,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '2018',
  },
  extends: [
    // https://github.com/mysticatea/eslint-plugin-node
    'plugin:node/recommended',
  ],
  rules: {
    'no-console': 'off',
    'node/no-unpublished-require': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-extraneous-import': 'error',
    'node/no-missing-import': 'error',
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
  },
}
