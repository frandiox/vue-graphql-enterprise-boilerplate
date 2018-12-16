import makeAssertionDirectives from '../utils/make-assertion-directives'
import { UserInputError } from '../errors'

const getQueryStr = ({ req: { body: { query } = '' } }) => query

// Calculate max depth of a GraphQL query string
export function calculateQueryDepth(query) {
  let depth = -1
  let maxDepth = depth

  for (let letter of query) {
    switch (letter) {
      case '{':
        if (++depth > maxDepth) maxDepth = depth
        break
      case '}':
        depth--
    }
  }

  return maxDepth
}

const assertions = {
  maxDepth(ctx, args) {
    const query = getQueryStr(ctx)
    const currentDepth = calculateQueryDepth(query)
    if (currentDepth > args.depth) {
      throw new UserInputError(
        `Too many nested queries. Maximum is ${args.depth}, got ${currentDepth}`
      )
    }
  },
}

export const constraintAssertions = assertions
export const constraintDirectives = makeAssertionDirectives(assertions)
