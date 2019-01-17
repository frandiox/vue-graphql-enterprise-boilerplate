# Setup and development

- [First-time setup](#first-time-setup)
- [Installation](#installation)
- [External services](#external-services)
- [Dev server](#dev-server)
  - [Developing with the production API](#developing-with-the-production-api)
- [Generators](#generators)
- [Aliases](#aliases)
- [Globals](#globals)
  - [Base components](#base-components)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/) (at least the latest LTS)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) (at least 1.0)

Then update the following files to suit your application:

- `src/app.config.js` (provides metadata about your app)
- `.circleci/config.yml` (assuming you want to automatically [deploy to production](production.md) with continuous integration)

Optionally, add your environment variables to a `.env`, `.env.local` or `.env.[mode]` file and they will be included in `process.env` by Webpack (they must be prefixed wihth `VUE_APP_`). More info in [Vue CLI docs](https://github.com/vuejs/vue-cli/blob/dev/docs/guide/mode-and-env.md)

## Installation

This project uses [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) in order to link the dependencies together and optimize the installation.

```bash
# Install dependencies from package.json and server/package.json
yarn
```

## External services

In order to use this boilerplate as is, we need free accounts in Auth0 for authentication and Prisma for database. See [Languages and Technologies (backend)](techback.md) for more information.

## Dev server

> Note: If you're on Linux and see an `ENOSPC` error when running the commands below, you must [increase the number of available file watchers](https://stackoverflow.com/questions/22475849/node-js-error-enospc#answer-32600959).

```bash
# Launch a full dev server (front and back ends)
yarn dev

# Launch dev server for frontend
yarn dev:front

# Launch dev server for backend
yarn dev:back

# Launch the dev server and automatically open it in
# your default browser when ready
yarn dev --open

# Launch the dev server with the Cypress client for
# test-driven development in a friendly interface
yarn e2e:dev

# Run all unit tests.
# Add '--coverage' for coverage or '-u' to update snapshots
yarn unit [-u] [--coverage]

# Launch database + app GraphQL playground
yarn playground

# Acceess Prisma CLI
yarn prisma [command]

# Check scripts in package.json for more commands
```

### Developing with the production API

WIP

## Generators

This project includes generators to speed up common development tasks. Commands include:

```bash
# Generate a new component with adjacent unit test
yarn new component

# Generate a new view component with adjacent unit test
yarn new view

# Generate a new layout component with adjacent unit test
yarn new layout

# Generate a new utility function with adjacent unit test
yarn new util

# Generate a new end-to-end spec
yarn new e2e

# Generate a new GraphQL query/mutation
yarn new gql
```

Update existing or create new generators in the `_templates` folder, with help from the [Hygen docs](http://www.hygen.io/).

## Aliases

To simplify referencing local modules and refactoring, you can set aliases to be shared between dev and unit tests in `jsconfig.json`. As a convention, this project uses an `@` prefix to denote aliases.

## Globals

### Base components

[Base components](https://vuejs.org/v2/style-guide/#Base-component-names-strongly-recommended) (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with the `base-` prefix (`base [name]` when using generator). Since these components are typically used in place of raw HTML element (and thus used as frequently), they're automatically globally registered for convenience. This means you don't have to import and locally register them to use them in templates.
