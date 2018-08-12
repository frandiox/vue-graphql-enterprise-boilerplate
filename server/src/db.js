import { Prisma } from 'prisma-binding'

export default new Prisma({
  typeDefs: 'src/generated/prisma.graphql', // the Prisma DB schema
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
  secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
  // debug: process.env.NODE_ENV === 'development', // log all GraphQL queries & mutations
})
