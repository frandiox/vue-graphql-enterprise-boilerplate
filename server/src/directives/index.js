const { AuthError } = require('../errors')

const getUser = ({ request: { user } = {} }) => user

const hasRole = (roles, ctx) => {
  const { role } = getUser(ctx) || {}
  return role && roles.includes(role)
}

module.exports = {
  isAuthenticated(next, source, args, ctx) {
    if (getUser(ctx)) return next()
    throw new AuthError('Access Token is missing or might be expired')
  },

  hasRole(next, source, { roles }, ctx) {
    if (hasRole(roles, ctx)) return next()
    throw new AuthError('Insufficient permissions')
  },

  isAdmin(next, source, args, ctx) {
    if (hasRole(['ADMIN'], ctx)) return next()
    throw new AuthError('Insufficient permissions')
  },
}
