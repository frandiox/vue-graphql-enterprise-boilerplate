class DefaultError extends Error {
  constructor(...messages) {
    super(messages.join('. ') + '.')
  }
}

export class AuthError extends DefaultError {
  constructor(...messages) {
    super('Not authorized', ...messages)
  }
}

export class BadRequestError extends DefaultError {
  constructor(...messages) {
    super('Bad request', ...messages)
  }
}
