import http from 'http'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { applyMiddleware as applyGraphQLMiddleware } from 'graphql-middleware'

/**
 *
 * @description Creates an Apollo Server. Setup based on `vue-cli-plugin-apollo`.
 * @param {Object} app Express application
 * @param {Object} options Apollo options
 * @returns {Object} HTTP Server
 */
export default function createApolloServer(
  app,
  {
    // Main options
    graphqlEndpoint = '',
    typeDefs = {},
    resolvers = {},
    schemaDirectives = {},
    directiveResolvers = {},
    graphqlMiddlewares = [],
    dataSources = () => ({}),
    context = () => ({}),
    // Subscriptions
    subscriptionsEndpoint = '',
    // Mocks
    mocks,
    // Apollo Engine
    engineKey = '',
    // HTTP options
    cors = true,
    timeout = 120000,
    // Extra options for Apollo Server
    apolloServerOptions = {},
  }
) {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives,
    directiveResolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  })

  // Apollo server options
  const options = {
    ...apolloServerOptions,
    schema: applyGraphQLMiddleware(schema, ...graphqlMiddlewares),
    tracing: true,
    cacheControl: true,
    engine: engineKey ? { apiKey: engineKey } : false,
    dataSources,
    // Resolvers context in POST requests
    context: async ({ req, connection }) => {
      let contextData
      try {
        if (connection) {
          contextData = await context({ connection })
        } else {
          contextData = await context({ req, request: req })
        }
      } catch (err) {
        console.error(err)
        throw err
      }
      return contextData
    },
    // Resolvers context in WebSocket requests
    subscriptions: {
      path: subscriptionsEndpoint,
      onConnect: async (connection, websocket) => {
        let contextData = {}
        try {
          contextData = await context({
            connection,
            websocket,
          })
        } catch (err) {
          console.error(err)
          throw err
        }
        return contextData
      },
    },
  }

  // Automatic mocking
  if (mocks) {
    options.mocks = mocks

    if (process.env.NODE_ENV === 'production') {
      console.warn(`⚠️  Automatic mocking is enabled in production`)
    } else {
      console.info(`✔️  Automatic mocking is enabled`)
    }
  }

  // Apollo Server
  const server = new ApolloServer(options)

  // Express middleware
  server.applyMiddleware({
    app,
    cors,
    path: graphqlEndpoint,
    // gui: {
    //   endpoint: graphqlEndpoint,
    //   subscriptionEndpoint: graphqlSubscriptionsPath,
    // },
  })

  // Create HTTP server and add subscriptions
  const httpServer = http.createServer(app)
  httpServer.setTimeout(timeout)
  server.installSubscriptionHandlers(httpServer)

  return httpServer
}
