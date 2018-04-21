const { AuthError } = require('../errors')

const getUser = ({ request: { user } = {} }) => {
  if (!user) throw new AuthError()
  return user
}

module.exports = {
  isAuthenticated(next, source, args, ctx) {
    getUser(ctx)
    return next()
  },

  hasRole(next, source, { roles }, ctx) {
    const { role } = getUser(ctx)
    if (!roles.includes(role)) throw new AuthError()
    return next()
  },
}
