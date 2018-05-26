const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const { AuthError } = require('../../errors')

const jwks = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 1,
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

function verifyAndDecodeIdToken(idToken) {
  return new Promise((resolve, reject) => {
    const { header, payload } = jwt.decode(idToken, { complete: true })

    if (!header || !header.kid || !payload) {
      return reject(new AuthError('Invalid Token'))
    }

    jwks.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return reject(
          new AuthError('Could not get signing key: ' + err.message)
        )
      }

      jwt.verify(
        idToken,
        key.publicKey,
        { algorithms: ['RS256'] },
        (err, decoded) =>
          err
            ? reject(new AuthError('JWT verify error: ' + err.message))
            : resolve(decoded)
      )
    })
  })
}

module.exports = {
  async authenticate(parent, { idToken }, ctx, info) {
    let userToken = null

    try {
      userToken = await verifyAndDecodeIdToken(idToken)
    } catch (err) {
      throw new Error(err.message)
    }

    const [identity, auth0id] = userToken.sub.split('|')

    let user = await ctx.db.query.user({ where: { auth0id } }, info)

    if (!user) {
      user = await ctx.db.mutation.createUser({
        data: {
          identity,
          auth0id,
          email: userToken.email,
          // Other data can be added here from Auth0 user
        },
      })
    }

    return user
  },
}
