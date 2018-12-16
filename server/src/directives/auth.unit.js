import { authAssertions } from './auth'
import { AuthenticationError, ForbiddenError } from '../errors'

describe('isAuthenticated directive', () => {
  const { isAuthenticated } = authAssertions

  it('throws error if the user is not authenticated', () => {
    const req = { user: undefined }
    expect(() => isAuthenticated({ req })).toThrow(AuthenticationError)
  })

  it('passes if user is authenticated', () => {
    const req = { user: {} }
    expect(() => isAuthenticated({ req })).not.toThrow()
  })
})

describe('hasRole directive', () => {
  const { hasRole } = authAssertions

  it("throws error if the user's role does not match", () => {
    const req = { user: { role: 'something else' } }
    const args = { roles: ['something'] }

    expect(() => hasRole({}, args)).toThrow(AuthenticationError)
    expect(() => hasRole({ req }, args)).toThrow(ForbiddenError)
  })

  it("passes if the user's role matches", () => {
    const req = { user: { role: 'something' } }
    const args = { roles: ['something'] }

    expect(() => hasRole({ req }, args)).not.toThrow()
  })
})
