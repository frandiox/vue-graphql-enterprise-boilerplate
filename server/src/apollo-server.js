import http from 'http'
import { ApolloServer } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'

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
    context = () => ({}),
    // Subscriptions
    subscriptionsEndpoint = '',
    pubsub = new PubSub(),
    // Mocks
    enableMocks = false,
    mocks = {},
    // Apollo Engine
    integratedEngine = false,
    enableEngine = false,
    engineKey = '',
    // HTTP options
    cors = '*',
    timeout = 120000,
    // Extra options for Apollo Server
    apolloServerOptions = {},
  }
) {
  // Apollo server options
  const options = {
    ...apolloServerOptions,
    typeDefs,
    resolvers,
    schemaDirectives,
    tracing: true,
    cacheControl: true,
    engine: !integratedEngine,
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
      contextData = { ...contextData, pubsub }
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
          contextData = { ...contextData, pubsub }
        } catch (err) {
          console.error(err)
          throw err
        }
        return contextData
      },
    },
  }

  // Automatic mocking
  if (enableMocks) {
    options.mocks = mocks

    if (process.env.NODE_ENV === 'production') {
      console.warn(`⚠️  Automatic mocking is enabled in production`)
    } else {
      console.info(`✔️  Automatic mocking is enabled`)
    }
  }

  // Apollo Engine
  if (enableEngine && integratedEngine) {
    if (engineKey) {
      options.engine = {
        apiKey: engineKey,
      }
    }
  } else {
    options.engine = false
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
