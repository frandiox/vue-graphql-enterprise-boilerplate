const index = require('.')

describe('@utils/calculate-query-depth', () => {
  it('correctly calculates depth of query', () => {
    const queryStr = `
      query TestQuery {
        tests {
          id
          owner {
            id
            name
            group {
              id
              name
            }
          }
          updatedAt {
            day
            month
            year
          }
        }
      }
    `
    const depth = index.calculateQueryDepth(queryStr)
    expect(depth).toBe(3)
  })

  it('correctly deals with empty strings', () => {
    const queryStr = ''
    const depth = index.calculateQueryDepth(queryStr)
    expect(depth).toBe(-1)
  })
})
