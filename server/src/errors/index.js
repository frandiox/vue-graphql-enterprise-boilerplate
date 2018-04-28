class DefaultError extends Error {
  constructor(...messages) {
    super(messages.join('. ') + '.')
  }
}

class AuthError extends DefaultError {
  constructor(...messages) {
    super('Not authorized', ...messages)
  }
}

class BadRequestError extends DefaultError {
  constructor(...messages) {
    super('Bad request', ...messages)
  }
}

module.exports = {
  AuthError,
  BadRequestError,
}
