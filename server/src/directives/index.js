import { AuthError } from '../errors'
import { SchemaDirectiveVisitor } from 'apollo-server-express'

const getUser = ({ req: { user } = {} }) => user

const hasRole = (roles, ctx) => {
  const { role } = getUser(ctx) || {}
  return role && roles.includes(role)
}

// Directive resolvers (apollo v1 syntax)
export const directiveResolvers = {
  isAuthenticated(next, source, args, ctx) {
    if (getUser(ctx)) return next()
    throw new AuthError('Access Token is missing or might be expired')
  },

  hasRole(next, source, { roles }, ctx) {
    if (hasRole(roles, ctx)) return next()
    throw new AuthError('Insufficient permissions')
  },

  isAdmin(next, source, args, ctx) {
    if (hasRole(['ADMIN'], ctx)) return next()
    throw new AuthError('Insufficient permissions')
  },
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
