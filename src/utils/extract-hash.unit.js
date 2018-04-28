import extractHash from './extract-hash'

describe('@utils/extract-hash', () => {
  it('correctly parses a hash string', () => {
    const url = 'http://localhost:3090/'
    const hash = '#a=1&b=2&c'
    const location = { hash, href: url + hash }
    const history = { replaceState: jest.fn() }
    const hashMap = extractHash(location, history)
    expect(hashMap).toHaveProperty('a', '1')
    expect(hashMap).toHaveProperty('b', '2')
    expect(hashMap).toHaveProperty('c', '')
    expect(history.replaceState).toHaveBeenCalledWith(
      null,
      expect.anything(),
      url
    )
  })

  it('corretly ignores lack of hash', () => {
    const location = { hash: '', href: 'http://localhost:3090/' }
    const history = { replaceState: jest.fn() }
    const hashMap = extractHash(location, history)
    expect(Object.keys(hashMap)).toHaveLength(0)
    expect(history.replaceState).not.toHaveBeenCalled()
  })
})
