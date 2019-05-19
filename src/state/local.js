// Defaults and resovlers for local store
import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    user: User
    project: Project
  }
`

export const initialState = {
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
