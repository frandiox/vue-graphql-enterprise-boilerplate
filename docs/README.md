# Vue Enterprise Boilerplate

[![CircleCI](https://circleci.com/gh/frandiox/vue-graphql-enterprise-boilerplate/tree/master.svg?style=svg)](https://circleci.com/gh/frandiox/vue-graphql-enterprise-boilerplate/tree/master)

## Intro

> A GraphQL ready, very opinionated Vue SPA template for Vue CLI 3

[This project](https://github.com/frandiox/vue-graphql-enterprise-boilerplate) is based on the [`vue-enterprise-boilerplate` template](https://github.com/chrisvfritz/vue-enterprise-boilerplate) made by [Chris Fritz](https://github.com/chrisvfritz) and [Guillaume Chau](https://github.com/Akryum)'s Vue + Apollo projects. It includes some extra opinionated features such as components inside folders and GraphQL integration with [Apollo](https://www.apollographql.com/), [Auth0](https://auth0.com/) and [Prisma](https://www.prisma.io/).

## Features

- [**Thorough documentation**](https://vue-graphql.netlify.com/): Written with the same care as Vue's core docs to quickly train new team members and consolidate knowledge.
- [**Guaranteed consistency**](http://vue-graphql.netlify.com/linting.html): Opinionated linting for Vue, JavaScript/JSON, SCSS, and Markdown, integrated into Visual Studio Code and run against staged files on pre-commit.
- [**First-class tests**](http://vue-graphql.netlify.com/tests.html): Practice test-driven development with both unit and end-to-end tests. Unit tests with Jest live as first-class citizens alongside your source files, while Cypress provides reliable end-to-end tests in an intuitive GUI for development.
- [**Speedy development**](http://vue-graphql.netlify.com/tests.html): Between [configurable generators](http://vue-graphql.netlify.com/tests.html#generators), [handy aliases](http://vue-graphql.netlify.com/tests.html#aliases), and [global base components](http://vue-graphql.netlify.com/tests.html#base-components), your productivity will skyrocket.
- [**Included authentication & authorization patterns**](http://vue-graphql.netlify.com/auth.html): [Auth0](https://auth0.com/) for authentication and schema directives for authorization against user roles.
- [**GraphQL ready (even for the DB)**](http://vue-graphql.netlify.com/backend.html): Integrated with GraphQL and all its features from the client to the database: [`apollo-link-state`](https://www.apollographql.com/docs/link/links/state.html) as the local store; [`apollo-client`](https://www.apollographql.com/client) and [`apollo-server` (v2)](https://www.apollographql.com/server) for client-server communication; and [Prisma](https://www.prisma.io/) as a GraphQL layer on top of your DB.

## Getting started

```bash
# 1. Clone the repository.
git clone https://github.com/frandiox/vue-enterprise-boilerplate.git my-new-project

# 2. Enter your newly-cloned folder.
cd my-new-project

# 3. Install dependencies.
yarn

# 4. Replace this README's CI badge with a note about when you started
# and a link to a compare URL, so that you can always get an overview
# of new features added to the boilerplate since you cloned.
node _start.js

# 5. Delete the start script, as there can be only one beginning.
rm _start.js

# 6. Read the documentation linked below.

# 7. Update `.env` file with your corresponding keys from Auth0 and Prisma.
# Have a look at the docs for step by step guides on how to setup these services.
```

## Documentation

Read the [docs here](https://vue-graphql.netlify.com/) or check the `docs` folder.

## FAQ

**Why would I use this boilerplate instead of generating a new project with [Vue CLI](https://github.com/vuejs/vue-cli) directly?**

Vue CLI aims for flexibility, making it as simple as possible for any team to set up a new project, no matter how big or small, whether it's an app or a library, or what languages and technologies are being used.

This boilerplate makes more assumptions. It assumes you're building a large app, possibly developed by a large team. It also makes a lot of default choices for you, based on what tends to work well for large, enterprise projects. At the same time, it aims to educate and empower users to configure these defaults to ideally suit their specific app and team.

**Why would I use this boilerplate instead of [Nuxt](https://nuxtjs.org/)?**

Nuxt is like a really smart personal assistant, immediately making you more productive by taking care of many concerns _for you_. This boilerplate is more of a personal coach, aiming to educate and empower users to essentially configure their _own_ framework, ideally suited to their app and team.

If what you're building is very well-defined, with requirements and technical challenges that won't drastically change over time, I'd probably recommend Nuxt instead. For the needs of common applications, it's more than up to the task. If you're a startup trying to prove product-market fit and your primary goal is initial development speed, that's also a point in Nuxt's favor.

Here's when you might prefer building a project off the boilerplate instead:

- The requirements for the product are very likely to change over time and you want to maintain maximum flexibility and control.
- You'd like to focus on developing skills that will transfer across _any_ Vue project.
- You're working in a large team, so need tooling to help everyone avoid common mistakes, write in a consistent style, and avoid bikeshedding in PRs.

Finally, it's not an either-or situation. This boilerplate demonstrates many useful patterns for building robust applications that can also be applied to Nuxt apps. That means you could build a project with Nuxt, while still using this boilerplate as a study guide.
