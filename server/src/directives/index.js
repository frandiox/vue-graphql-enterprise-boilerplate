import { AuthenticationError, ForbiddenError } from '../errors'
import { SchemaDirectiveVisitor } from 'apollo-server-express'

const getUser = ({ req = {}, request = {} }) => req.user || request.user || null
const hasRole = (roles, ctx) => {
  const { role = '' } = getUser(ctx) || {}
  return role && roles.includes(role)
}

const assertAuth = ctx => {
  if (!getUser(ctx)) {
    throw new AuthenticationError('Access token is missing or expired')
  }
}

// Directive resolvers (apollo v1 syntax)
export const directiveResolvers = {
  isAuthenticated(next, source, args, ctx) {
    assertAuth(ctx)
    return next()
  },

  hasRole(next, source, { roles }, ctx) {
    assertAuth(ctx)
    if (!hasRole(roles, ctx)) {
      throw new ForbiddenError('Insufficient permissions')
    }
    return next()
  },

  isAdmin(next, source, args, ctx) {
    assertAuth(ctx)
    if (!hasRole(['ADMIN'], ctx)) {
      throw new ForbiddenError('Insufficient permissions')
    }
    return next()
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
