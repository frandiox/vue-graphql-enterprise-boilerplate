import express from 'express'
import { importSchema } from 'graphql-import'

import verifyAccessToken from './middleware/verify-access-token'
import getUserFromDB from './middleware/get-user-from-db'

import createApolloServer from './apollo-server'
import * as resolvers from './resolvers'
import { schemaDirectives } from './directives'
import { formatError } from './errors'

import db from './db'
import pubsub from './pubsub'

const { GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTIONS, PORT, NODE_ENV } = process.env

const app = express()

// Middlewares for HTTP and WS connections
const connectionMiddlewares = [
  verifyAccessToken, // Verify and expose token information in req.user
  getUserFromDB, // Transform req.user to real DB user
]

app.post(GRAPHQL_ENDPOINT, ...connectionMiddlewares)

const server = createApolloServer(app, {
  graphqlEndpoint: GRAPHQL_ENDPOINT,
  subscriptionsEndpoint: GRAPHQL_SUBSCRIPTIONS,
  wsMiddlewares: connectionMiddlewares,
  apolloServerOptions: { formatError },
  typeDefs: importSchema('src/schema/index.graphql'),
  resolvers,
  schemaDirectives,
  context: params => ({
    ...params,
    db,
    pubsub,
  }),
})

server.listen({ port: PORT }, () => {
  console.log(
    `\n🚀 GraphQL Server is running on http://localhost:${PORT}${GRAPHQL_ENDPOINT} in "${NODE_ENV}" mode\n`
  )
})
