const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the Prisma DB schema
      endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
      secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
      debug: true, // log all GraphQL queries & mutations
    }),
  }),
})

server.start(
  {
    port: process.env.PORT || 4000,
    endpoint: process.env.GRAPHQL_ENDPOINT || '/',
    subscriptions: process.env.GRAPHQL_SUBSCRIPTIONS || '/',
    playground: process.env.GRAPHQL_PLAYGROUND || '/',
  },
  ({ port }) => console.log(`Server is running on http://localhost:${port}`) // eslint-disable-line no-console
)
