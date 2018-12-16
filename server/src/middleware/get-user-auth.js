import db from '../db'

const authClaims = ['id', 'role']

export default async function(req, res, next) {
  if (req.user) {
    // Get custom claims from Auth0 access token
    let user = req.user[process.env.AUTH0_OIDC_NAMESPACE + 'authInfo']

    // If data is not enough, get user from DB as a fallback (slower but safe)
    if (!user || !authClaims.every(claim => !!user[claim])) {
      user = await db.query.user(
        { where: { authId: req.user.sub } },
        `{ ${authClaims.join(' ')} }`
      )
    }

    // Expose user in request object
    req.user = user ? { token: req.user, ...user } : null
  }

  next()
}
