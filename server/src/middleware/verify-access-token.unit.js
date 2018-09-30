import verifyAccessToken from './verify-access-token'

describe('verifyAccessToken', () => {
  it('replies with error message if token is invalid', done => {
    const req = {
      headers: {
        authorization: 'something-invalid',
      },
    }

    const nextMock = jest.fn()
    const res = {
      status(status) {
        expect(status).toBe(401)
        return this
      },
      send(message) {
        expect(typeof message).toBe('string')
        setTimeout(() => {
          expect(nextMock).not.toHaveBeenCalled()
          done()
        }, 0)
      },
    }

    verifyAccessToken(req, res, nextMock)
    expect(nextMock).not.toHaveBeenCalled()
  })

  it('does nothing if credentials are not provided', () => {
    const req = { headers: {} }
    const nextMock = jest.fn()

    verifyAccessToken(req, {}, nextMock)
    expect(nextMock).toHaveBeenCalledTimes(1)
    expect(nextMock).toHaveBeenCalledWith()
  })
})
