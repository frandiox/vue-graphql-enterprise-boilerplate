class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  AuthError,
}
