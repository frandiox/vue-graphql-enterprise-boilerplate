import Vue from 'vue'
import VueApollo from 'vue-apollo'
import createApolloClient from './apollo'

// Install the vue plugin
Vue.use(VueApollo)

// Config
const options = {
  ssr: false,
  base: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000',
  endpoints: {
    graphql: process.env.GRAPHQL_PATH || '/graphql',
    subscription: process.env.GRAPHQL_SUBSCRIPTIONS_PATH || '/graphql',
  },
  persisting: false,
  subscriptions: false,
}

// Create apollo client
export const apolloClient = createApolloClient(options)

// Create vue apollo provider
export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
