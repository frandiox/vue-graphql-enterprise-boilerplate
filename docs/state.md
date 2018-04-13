# State management

Both remote and local state are managed by Apollo Client. Apollo + Vue integration is provided by `vue-apollo` package via Vue CLI plugins. All the Apollo relevant configuration and data for both remote and local sides is located in `src/state` directory, including global queries and mutations.

`apollo-link-state` allows using the already existing Apollo store for managing local state instead of including an extra store like Vuex. This means that, in order to access or update your local state, you use GraphQL queries and mutations just like you would for data from a server. Apollo's caching and offline persistence are also supported for local state out of the box. On top of that, [Apollo DevTools](https://github.com/apollographql/apollo-client-devtools) are also compatible for debugging your store. Local state is stored in `src/state` in shape of `resolvers` and `defaults`.

To wrap your head around our state management, have a look first at [Apollo Client introduction](https://www.apollographql.com/docs/) and then at [Vue Apollo integration docs](https://github.com/akryum/vue-apollo). Finally, read [`apollo-link-state` docs](https://www.apollographql.com/docs/link/links/state.html) for more information on local state management.

The Apollo configuration requires three environment variables that you need to set up: `GRAPHQL_ENDPOINT`, `GRAPHQL_PATH` and `GRAPHQL_SUBSCRIPTIONS_PATH`. These can be included in `.env`.
