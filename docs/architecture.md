# Architecture

- [`_templates`](#_templates)
- [`.circleci`](#circleci)
- [`.vscode`](#vscode)
- [`.vuepress`](#vuepress)
- [`docs`](#docs)
- [`public`](#public)
  - [`index.html`](#indexhtml)
- [`src`](#src)
  - [`assets`](#assets)
  - [`components`](#components)
  - [`design`](#design)
  - [`router`](#router)
  - [`state`](#state)
  - [`utils`](#utils)
  - [`app.config.js`](#appconfigjs)
  - [`app.vue`](#appvue)
  - [`main.js`](#mainjs)
- [`tests`](#tests)
- [`server`](#server)

## `_templates`

Generator templates to speed up development. See [the development doc](development.md#generators) for more.

## `.circleci`

Configuration for continuous integration with [Circle CI](https://circleci.com/). See [the production doc](production.md#from-circle-ci) for more.

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code. See [the editors doc](editors.md#visual-studio-code) for more.

## `.vuepress`

Configuration files for Vuepress, the tool that builds our local documentation. See [the official docs](https://vuepress.vuejs.org/) for more.

## `docs`

Collection of markdown files containing documentation.

## `public`

Where you'll keep any static assets, to be added to the `dist` directory without processing from our build system.

### `index.html`

This one file actually _does_ get processed by our build system, allowing us to inject some information from Webpack with [EJS](http://ejs.co/), such as the title, then add our JS and CSS.

## `src`

Where we keep all our source files for the frontend.

### `assets`

This project manages assets via Vue CLI. Learn more about [its asset handling here](https://github.com/vuejs/vue-cli/blob/dev/docs/assets.md).

### `components`

Where all the common components in our app will live, including our [global base components](development.md#base-components). Components that are used by at least other 2 components should be placed here.

### `design`

Where we keep our [design variables and tooling](techfront.md#design-variables-and-tooling).

### `router`

Where the router, routes, and any routing-related components (views & layouts) live. See [the routing doc](routing.md) for more.

### `state`

Where all our global state management lives (local and remote), together with the "actions" that can modify it (GQL queries). See [the state management doc](state.md) for more.

### `utils`

These are utility functions you may want to share between many files in your application. They will always be pure and never have side effects, meaning if you provide a function the same arguments, it will always return the same result. These should also never directly affect the DOM or interface with our global state.

### `app.config.js`

Contains app-specific metadata.

### `app.vue`

The root Vue component that simply delegates to the router view. This is typically the only component to contain global CSS.

### `main.js`

The entry point to our app, were we create our Vue instance and mount it to the DOM.

## `tests`

Where all our tests go. See [the tests doc](tests.md) for more.

## `server`

Where all our backend server files are located. Have a look at [the backend docs](backend.md) to learn more about it.
