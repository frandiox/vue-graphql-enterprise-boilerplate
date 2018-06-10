// Defaults and resovlers for local store (apollo-link-state)

export const defaults = {
  user: null,
}

export const resolvers = {
  Mutation: {
    setSelf: (parent, { user }, { cache }) => {
      cache.writeData({
        data: {
          user: user ? { ...user, __typename: 'User' } : null,
        },
      })
      return null
    },
  },
}
