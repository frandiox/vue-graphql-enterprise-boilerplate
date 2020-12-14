import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from '../../errors'
import { findUser, createUser, deleteUser } from '../../models/user'
import got from 'got'

const jwks = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 1,
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

function verifyAndDecodeIdToken(idToken) {
  const invalidTokenMessage = 'Invalid id token.'

  return new Promise((resolve, reject) => {
    const { header, payload } = jwt.decode(idToken, { complete: true }) || {}

    if (!header || !header.kid || !payload) {
      return reject(new AuthenticationError(invalidTokenMessage))
    }

    jwks.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return reject(
          new AuthenticationError(
            `${invalidTokenMessage} Could not get signing key: ${err.message}`
          )
        )
      }

      jwt.verify(
        idToken,
        key.publicKey,
        { algorithms: ['RS256'] },
        (err, decoded) =>
          err
            ? reject(
                new AuthenticationError(
                  `${invalidTokenMessage} JWT verification error: ${err.message}`
                )
              )
            : resolve(decoded)
      )
    })
  })
}

export default {
  async authenticate(parent, { idToken }, ctx, info) {
    const userToken = await verifyAndDecodeIdToken(idToken)

    const authId = userToken.sub

    let user = await findUser({ where: { authId } }, { info })

    if (!user) {
      // If we extended idToken in an Auth0 rule, data can be used here
      // const { ... } = userToken[process.env.AUTH0_OIDC_NAMESPACE + 'user_metadata']

      // Generate random name for the user
      let name
      try {
        const { body } = await got(
          'http://names.drycodes.com/1?nameOptions=girl_names',
          { json: true }
        )
        name = body[0].replace('_', ' ')
      } catch (error) {
        name = 'Fake Name'
      }

      user = await createUser(
        {
          data: {
            authId,
            email: userToken.email,
            name,
            // Other data can be added here from Auth0 user
          },
        },
        { info }
      )
    }

    return user
  },

  async deleteUser(parent, args, ctx, info) {
    return deleteUser(args, { info })
  },
}
