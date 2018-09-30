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

const { default: getUserFromDB } = require('./get-user-from-db')

describe('getUserFromDB middleware', () => {
  it('finds the user in DB if token information is provided', async () => {
    const sub = 'identity|id_number'
    const req = {
      user: { sub },
    }

    const next = jest.fn()

    await getUserFromDB(req, null, next)

    expect(req.user.test).toBe(TEST)
    expect(req.user.token.sub).toBe(sub)
    expect(next).toHaveBeenCalled()
  })

  it('does nothing without token information', async () => {
    const req = {
      user: null,
    }

    const next = jest.fn()

    await getUserFromDB(req, null, next)

    expect(req.user).toBeNull()
    expect(next).toHaveBeenCalled()
  })
})
