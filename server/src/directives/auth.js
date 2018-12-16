import makeAssertionDirectives from '../utils/make-assertion-directives'
import { AuthenticationError, ForbiddenError } from '../errors'
import { getUser, hasRole } from '../models/user'

const assertAuth = ctx => {
  if (!getUser(ctx)) {
    throw new AuthenticationError('Access token is missing or expired')
  }
}

const insufficientPermisions = 'Insufficient permissions'

const assertions = {
  isAuthenticated(ctx, args) {
    assertAuth(ctx)
  },

  hasRole(ctx, { roles }) {
    assertAuth(ctx)
    if (!hasRole(ctx, roles)) {
      throw new ForbiddenError(insufficientPermisions)
    }
  },
}

export const authAssertions = assertions
export const authDirectives = makeAssertionDirectives(assertions)
