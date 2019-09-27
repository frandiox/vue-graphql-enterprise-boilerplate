import VueApollo from 'vue-apollo'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import typeMocks from '../../server/src/resolvers/mocks'
import { typeDefs } from '../../server/src/schema'
import {
  typeDefs as localTypeDefs,
  resolvers as localResolvers,
  initialState as localInitialState,
} from '@state/local'

// ===
// Configure Apollo
// ===
const schema = makeExecutableSchema({ typeDefs })

export const apolloMockProvider = (resolvers = {}) => {
  const mocks = {
    // Mocks can only contain functions
    Query: () => resolvers.Query || resolvers.query || {},
    Mutation: () => resolvers.Mutation || resolvers.mutation || {},
  }

  addMockFunctionsToSchema({
    schema,
    mocks: {
      ...typeMocks, // Global type mocks
      // Add here other global resolvers if necessary
      ...mocks, // Root Query/Mutation passed from each test
    },
    preserveResolvers: false,
  })

  const cache = new InMemoryCache()
  cache.writeData({
    data: {
      ...localInitialState,
      // Add here any local state specific for unit tests,
    },
  })

  const client = new ApolloClient({
    cache,
    resolvers: localResolvers,
    typeDefs: localTypeDefs,
    link: from([new SchemaLink({ schema })]),
  })

  return new VueApollo({
    defaultClient: client,
  })
}
