import { SchemaDirectiveVisitor } from 'apollo-server-express'

function defaultFieldResolver(source, args, contextValue, info) {
  // ensure source is a value for which property access is acceptable.
  if (typeof source === 'object' || typeof source === 'function') {
    const property = source[info.fieldName]
    if (typeof property === 'function') {
      return source[info.fieldName](args, contextValue, info)
    }
    return property
  }
}

export default function makeAssertionDirectives(assertions) {
  Object.keys(assertions).reduce(
    (acc, key) => ({
      ...acc,
      [key]: class extends SchemaDirectiveVisitor {
        visitFieldDefinition(field) {
          const assert = assertions[key]
          const originalResolver = field.resolve || defaultFieldResolver
          field.resolve = (...args) => {
            const context = args[2]
            assert(context, this.args)
            return originalResolver(...args)
          }
        }
      },
    }),
    {}
  )
}
