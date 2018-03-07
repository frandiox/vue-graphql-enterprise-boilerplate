import Vue from 'vue'
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'
import appSyncConfig from './AppSync'

const client = new AWSAppSyncClient(
  {
    url: appSyncConfig.graphqlEndpoint,
    region: appSyncConfig.region,
    auth: {
      type: appSyncConfig.authenticationType,
      apiKey: appSyncConfig.apiKey,
    },
  },
  {
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  }
)

const appsyncProvider = new VueApollo({
  defaultClient: client,
})

Vue.use(VueApollo)

export default appsyncProvider.provide()
