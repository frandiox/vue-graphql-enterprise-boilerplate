import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { authDirectives } from './auth'
import { utilsDirectives } from './utils'

export const directiveResolvers = {
  ...authDirectives,
  ...utilsDirectives,
}

export const defaultFieldResolver = (source, args, contextValue, info) => {
  // ensure source is a value for which property access is acceptable.
  if (typeof source === 'object' || typeof source === 'function') {
    const property = source[info.fieldName]
    if (typeof property === 'function') {
      return source[info.fieldName](args, contextValue, info)
    }
    return property
  }
}

// Schema directives (apollo v2 syntax)
export const schemaDirectives = Object.keys(directiveResolvers).reduce(
  (acc, directiveName) => ({
    ...acc,
    [directiveName]: class extends SchemaDirectiveVisitor {
      visitFieldDefinition(field) {
        const resolver = directiveResolvers[directiveName]
        const originalResolver = field.resolve || defaultFieldResolver
        const directiveArgs = this.args
        field.resolve = (...args) => {
          const [source, , context, info] = args
          return resolver(
            async () => originalResolver.apply(field, args),
            source,
            directiveArgs,
            context,
            info
          )
        }
      }
    },
  }),
  {}
)
