const TEST = 'test'
jest.mock('prisma-binding')

require('prisma-binding').Prisma.mockImplementationOnce(() => ({
  query: {
    user() {
      return {
        test: TEST,
      }
    },
  },
}))

const { default: getUserAuth } = require('./get-user-auth')

describe('getUserAuth middleware', () => {
  it('uses auth claims from token if provided', async () => {
    const sub = 'identity|id_number'
    const { AUTH0_OIDC_NAMESPACE } = process.env
    process.env.AUTH0_OIDC_NAMESPACE = 'test/'
    const authPath = process.env.AUTH0_OIDC_NAMESPACE + 'auth'
    const authClaims = { id: 'test-id', role: 'TEST' }

    const req = { user: { sub, [authPath]: authClaims } }

    const next = jest.fn()
    await getUserAuth(req, null, next)

    process.env.AUTH0_OIDC_NAMESPACE = AUTH0_OIDC_NAMESPACE

    expect(req.user.token.sub).toBe(sub)
    expect(req.user.token[authPath]).toBe(authClaims)
    expect(req.user.id).toBe(authClaims.id)
    expect(req.user.role).toBe(authClaims.role)
    expect(next).toHaveBeenCalled()
  })

  it('finds the user in DB if token information is provided without auth claims', async () => {
    const sub = 'identity|id_number'
    const req = { user: { sub } }

    const next = jest.fn()

    await getUserAuth(req, null, next)

    expect(req.user.test).toBe(TEST)
    expect(req.user.token.sub).toBe(sub)
    expect(next).toHaveBeenCalled()
  })

  it('does nothing without token information', async () => {
    const req = {
      user: null,
    }

    const next = jest.fn()

    await getUserAuth(req, null, next)

    expect(req.user).toBeNull()
    expect(next).toHaveBeenCalled()
  })
})
