import jwksClient from 'jwks-rsa'
import jwt from 'express-jwt'

// Authentication middleware. When used,
// if the access token exists, it will be
// verified against the Auth0 JSON Web Key Set

export default jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 1,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  algorithms: ['RS256'],
  credentialsRequired: false, // For initial authorization

  // Validate audience, issuer and expiration
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  audience: process.env.AUTH0_AUDIENCE,
  ignoreExpiration: false,
})
