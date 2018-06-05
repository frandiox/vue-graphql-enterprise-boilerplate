export default {
  Mutation: {
    setSelf: (parent, { user }, { cache }) => {
      cache.writeData({ data: { user: { ...user, __typename: 'User' } } })
      return null
    },
  },
}
