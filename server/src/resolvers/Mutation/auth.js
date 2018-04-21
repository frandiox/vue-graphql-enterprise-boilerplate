const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const jwks = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 1,
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

function verifyAndDecodeIdToken(idToken) {
  return new Promise((resolve, reject) => {
    const { header, payload } = jwt.decode(idToken, { complete: true })

    if (!header || !header.kid || !payload) reject(new Error('Invalid Token'))

    jwks.getSigningKey(header.kid, (err, key) => {
      if (err) reject(new Error('Error getting signing key: ' + err.message))

      jwt.verify(
        idToken,
        key.publicKey,
        { algorithms: ['RS256'] },
        (err, decoded) => {
          if (err) reject(new Error('jwt verify error: ' + err.message))

          resolve(decoded)
        }
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

    const auth0id = userToken.sub.split('|')[1]

    let user = await ctx.db.query.user({ where: { auth0id } }, info)

    if (!user) {
      user = await ctx.db.mutation.createUser({
        data: {
          identity: userToken.sub.split(`|`)[0],
          auth0id: userToken.sub.split(`|`)[1],
          email: userToken.email,
          // Other data can be added here from Auth0 user
        },
      })
    }

    return user
  },
}
