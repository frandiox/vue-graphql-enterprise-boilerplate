# Prisma and database

[Prisma](https://prisma.io) is the GraphQL interface we use to communicate with the database. It consists of a service which translates our GraphQL queries/mutations to the database language. This service is deployed separately from our back end server (business logic) and acts as an intermediary between it and the database. Prisma can be connected to several types of databases, includinig MySQL, Postgres and MongoDB.

For development, Prisma provides a free demo server and database (MySQL) to test our applications very quickly, apart from a data browser where we can query and modify our data. To get started, register a free account in [Prisma Cloud](https://app.prisma.io/) and follow the UI to create a new custom service. Make sure this service is not the "demo" that already contains data, it must be empty. There will be an HTTP endpoint to connect to this service. Copy it and write it in the appropriate variable in `server/.env` file. Optionally, add any random Prisma secret in the same file to provide authentication with the service.

After doing this, there will be a new service in Prisma's development servers but it won't contain any schema or data yet. In order deploy some data, we use the Prisma CLI that should be already installed in the project. Move to `server` directory and run `yarn prisma` to see a list of the commands. Run `yarn prisma login` first to identify your local session and `yarn prisma deploy` to deploy the current schema and seed data to the newly created service. Check Prisma Cloud's data browser to make sure it now contains some data (users and posts).

Whenever `server/database` is modified you will need to run `yarn prisma deploy` to commit these changes to the Prisma service and database.

Other useful commands are `yarn prisma delete`, in case you want to start over, and `yarn prisma playground` to open a graphical playground where you can test the available API.

## Prisma binding

The back end applications communicates with Prisma service through [`prisma-binding` package](https://github.com/prisma/prisma-binding). When Prisma CLI deploys a new change, it downloads a generated database schema definition in `server/src/generated/prisma.graphql`. This contains all the available types, queries and mutations available in our service. Prisma binding provides functions to run these queries in a very handy way.

This binding is created in `server/src/db.js` and is provided in the context object to the resolvers.

As a side note, there is a new tool called Prisma Client which is an alternative to Prisma binding. The official Prisma documentation has been updated to use Prisma Client but, however, Prisma binding is still a better fit for some situations (e.g. schema delegation).
