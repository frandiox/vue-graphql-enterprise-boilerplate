import { ApolloError } from 'apollo-server-express'

export {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  SyntaxError,
  UserInputError,
  ValidationError,
} from 'apollo-server-express'

export function formatError(error) {
  // This can be used to send errors to third
  // party services like Sentry or Stackdriver

  return error
}

// Define custom Apollo errors here
export class ExternalServiceError extends ApolloError {
  constructor(message) {
    super(message, 'EXTERNAL_SERVICE_UNAVAILABLE')

    Object.defineProperty(this, 'name', { value: this.constructor.name })
  }
}
