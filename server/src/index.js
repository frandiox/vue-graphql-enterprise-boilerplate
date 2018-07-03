require('multienv-loader').load()

const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const verifyAccessToken = require('./middleware/verify-access-token')
const getUserFromDB = require('./middleware/get-user-from-db')

const resolvers = require('./resolvers')
const directiveResolvers = require('./directives')

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql', // the Prisma DB schema
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
  secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
  debug: true, // log all GraphQL queries & mutations
})

const server = new GraphQLServer({
  typeDefs: 'src/schema/index.graphql',
  resolvers,
  directiveResolvers,
  context: req => ({
    ...req,
    db,
  }),
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

// Verify and expose token information in req.user
server.express.post(
  server.options.endpoint,
  verifyAccessToken,
  (err, req, res, next) => {
    if (err) {
      return res.status(401).send(err.message)
    }
    next()
  }
)

// Transform req.user to real DB user
server.express.post(server.options.endpoint, (req, res, next) =>
  getUserFromDB(req, res, next, db)
)

server.start(
  {
    port: process.env.PORT || 4000,
    endpoint: process.env.GRAPHQL_ENDPOINT || '/',
    subscriptions: process.env.GRAPHQL_SUBSCRIPTIONS || '/',
    playground: process.env.GRAPHQL_PLAYGROUND || '/',
  },
  ({ port }) => console.log(`Server is running on http://localhost:${port}`) // eslint-disable-line no-console
)
