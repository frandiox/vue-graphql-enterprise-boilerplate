# Vue Enterprise Boilerplate

[![CircleCI](https://circleci.com/gh/chrisvfritz/vue-enterprise-boilerplate/tree/master.svg?style=svg)](https://circleci.com/gh/chrisvfritz/vue-enterprise-boilerplate/tree/master)

## Intro

> A GraphQL ready, very opinionated Vue SPA template for Vue CLI 3

[This project](https://github.com/frandiox/vue-graphql-enterprise-boilerplate) is based on the [`vue-enterprise-boilerplate` template](https://github.com/chrisvfritz/vue-enterprise-boilerplate) made by [Chris Fritz](https://github.com/chrisvfritz). This repo includes some extra opinionated features such as components inside folders and GraphQL integration with [Apollo](https://www.apollographql.com/), [Auth0](https://auth0.com/) and [Prisma](https://www.prisma.io/).

## Features

- [**Thorough documentation**](#documentation): Written with the same care as Vue's core docs to quickly train new team members and consolidate knowledge.
- [**Guaranteed consistency**](linting.md): Opinionated linting for Vue, JavaScript/JSON, SCSS, and Markdown, integrated into Visual Studio Code and run against staged files on pre-commit.
- [**First-class tests**](tests.md): Practice test-driven development with both unit and end-to-end tests. Unit tests with Jest live as first-class citizens alongside your source files, while Cypress provides reliable end-to-end tests in an intuitive GUI for development.
- [**Speedy development**](development.md): Between [configurable generators](development.md#generators), [handy aliases](development.md#aliases), and [global base components](development.md#base-components), your productivity will skyrocket.
- [**GraphQL ready**](backend.md): Integrated with GraphQL and all its features. Some external services are used to speed up development, such as Auth0 and Prisma Cloud.

## Getting started

```bash
# 1. Clone the repository.
git clone https://github.com/frandiox/vue-enterprise-boilerplate.git my-new-project

# 2. Enter your newly-cloned folder
cd my-new-project

# 3. Replace this README's CI badge with a note about when you started
# and a link to a compare URL, so that you can always get an overview
# of new features added to the boilerplate since you cloned.
node _start.js

# 4. Delete the start script, as there can be only one beginning.
rm _start.js

# 5. Read the documentation linked below for "Setup and development".
```

## Documentation

Read the [docs here](https://vue-graphql.netlify.com/). Otherwise, this project includes a `docs` folder with more details on:

1.  [Setup and development](development.md)
1.  [Architecture](architecture.md)
1.  [Languages and technologies (frontend)](techfront.md)
1.  [Routing, layouts, and views](routing.md)
1.  [Languages and technologies (backend)](techback.md)
1.  [Backend architecture](backend.md)
1.  [State management](state.md)
1.  [Tests and mocking the API](tests.md)
1.  [Linting and formatting](linting.md)
1.  [Editor integration](editors.md)
1.  [Building and deploying to production](production.md)
1.  [Troubleshooting](troubleshooting.md)

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
