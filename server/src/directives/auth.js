import { AuthenticationError, ForbiddenError } from '../errors'

const getUser = ({ req = {}, request = {} }) => req.user || request.user || null

const hasRole = (roles, ctx) => {
  const { role = '' } = getUser(ctx) || {}
  return role && roles.includes(role)
}

const assertAuth = ctx => {
  if (!getUser(ctx)) {
    throw new AuthenticationError('Access token is missing or expired')
  }
}

// Directive resolvers (apollo v1 syntax)
export const authDirectives = {
  isAuthenticated(next, source, args, ctx) {
    assertAuth(ctx)
    return next()
  },

  hasRole(next, source, { roles }, ctx) {
    assertAuth(ctx)
    if (!hasRole(roles, ctx)) {
      throw new ForbiddenError('Insufficient permissions')
    }
    return next()
  },

  isAdmin(next, source, args, ctx) {
    assertAuth(ctx)
    if (!hasRole(['ADMIN'], ctx)) {
      throw new ForbiddenError('Insufficient permissions')
    }
    return next()
  },
}
