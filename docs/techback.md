# Languages and technologies (backend)

- [Node.js](#nodejs)
  - [GraphQL](#graphql)
  - [Apollo Server](#apollo-server)
  - [Auth0](#auth0)
- [Database](#database)
  - [Prisma](#prisma)

## Node.js

In order to keep it simple, we are not using Babel for the backend since Node.js already supports most of the ES features (soon it will even support ES Modules).

### GraphQL

[GraphQL](https://graphql.org/) is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools. For guides about GraphQL, have a look at [How to GraphQL](https://www.howtographql.com/).

### Apollo Server

Since GraphQL is just a specification, we will need an actual GraphQL implementation for Node.js. [Apollo](https://www.apollographql.com/) will be the chosen one due to the many features it provides. For simplicity, however, we add [`graphql-yoga`](https://github.com/prismagraphql/graphql-yoga) to easily configure our Apollo server with Express.js (and add a bunch of extra features such as [GraphQL Playground](https://github.com/prismagraphql/graphql-playground)!).

### Auth0

Authentication is always a very important but incredibly tedious feature to implement. We will rely on [Auth0](https://auth0.com/) service for providing basic authentication. It offers a very generous free tier and is easy enough to get started quickly.

Have a look at [Authorization section](auth.md) for more information.

## Database

### Prisma

[Prisma](https://www.prisma.io) turns our database into a GraphQL API which can be consumed by our backend server. This means we only need to deal with GraphQL and its SDL to define data models and queries.

Prisma is open source and provides development servers (in [Prisma Cloud](https://www.prisma.io/cloud/)) with MySQL databases for free that will help us to get our project started very quickly.
