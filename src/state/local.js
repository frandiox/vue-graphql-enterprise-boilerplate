// Defaults and resovlers for local store
import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    example: String
  }
`

export const initialState = {
  example: 'example',
}

export const resolvers = {
  Mutation: {
    setExample: (parent, { example }, { cache }) => {
      cache.writeData({ data: { example } })
      return null
    },
  },
}
