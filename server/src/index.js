import express from 'express'

import verifyAccessToken from './middleware/verify-access-token'
import getUserAuth from './middleware/get-user-auth'

import createApolloServer from './apollo-server'
import * as resolvers from './resolvers'
import { typeDefs } from './schema'
import { schemaDirectives } from './directives'
import { formatError } from './errors'

import db from './db'
import pubsub from './pubsub'
import { logger } from './services/logger'

const { GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTIONS, PORT, NODE_ENV } = process.env

const app = express()

// Middlewares for HTTP and WS connections
const connectionMiddlewares = [
  verifyAccessToken, // Verify and expose token information in req.user
  getUserAuth, // Transform req.user to real DB user
]

app.post(GRAPHQL_ENDPOINT, ...connectionMiddlewares)

const server = createApolloServer(app, {
  graphqlEndpoint: GRAPHQL_ENDPOINT,
  subscriptionsEndpoint: GRAPHQL_SUBSCRIPTIONS,
  wsMiddlewares: connectionMiddlewares,
  apolloServerOptions: { formatError },
  typeDefs,
  resolvers,
  schemaDirectives,
  context: params => ({
    ...params,
    db,
    pubsub,
  }),
})

server.listen({ port: PORT }, () => {
  logger.info(
    `🚀 GraphQL Server is running on http://localhost:${PORT}${GRAPHQL_ENDPOINT} in "${NODE_ENV}" mode\n`
  )
})
