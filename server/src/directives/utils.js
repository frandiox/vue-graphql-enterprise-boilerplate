import { UserInputError } from '../errors'
import { calculateQueryDepth } from '../utils'

const getQueryStr = ({ req: { body: { query } = '' } }) => query

export const utilsDirectives = {
  maxDepth(next, source, args, ctx) {
    const query = getQueryStr(ctx)
    const currentDepth = calculateQueryDepth(query)
    if (currentDepth <= args.depth) return next()
    throw new UserInputError(
      `Too many nested queries. Maximum is ${args.depth}, got ${currentDepth}`
    )
  },
}
