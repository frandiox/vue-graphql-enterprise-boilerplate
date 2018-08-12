import http from 'http'
import { ApolloServer } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'

export default function(
  app,
  {
    graphqlEndpoint = process.env.GRAPHQL_ENDPOINT,
    subscriptionsEndpoint = process.env.GRAPHQL_SUBSCRIPTIONS,
    mode = process.env.NODE_ENV,
    integratedEngine = false,
    enableEngine = false,
    engineKey = '',
    cors = '*',
    timeout = 120000,
    mocks = {},
    enableMocks = false,
    typeDefs = {},
    resolvers = {},
    schemaDirectives = {},
    pubsub = new PubSub(),
    context = () => ({}),
  }
) {
  // Apollo server options
  let apolloServerOptions = {
    typeDefs,
    resolvers,
    schemaDirectives,
    tracing: true,
    cacheControl: true,
    engine: !integratedEngine,
    // Resolvers context from POST
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
    // Resolvers context from WebSocket
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
    apolloServerOptions.mocks = mocks

    if (mode === 'production') {
      console.warn(`Automatic mocking is enabled in production`)
    } else {
      console.log(`✔️  Automatic mocking is enabled`)
    }
  }

  // Apollo Engine
  if (enableEngine && integratedEngine) {
    if (engineKey) {
      apolloServerOptions.engine = {
        apiKey: engineKey,
      }
    }
  } else {
    apolloServerOptions.engine = false
  }

  // Apollo Server
  const server = new ApolloServer(apolloServerOptions)

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
