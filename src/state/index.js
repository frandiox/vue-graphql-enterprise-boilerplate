import { createProvider, onLogin, onLogout } from '@state/vue-apollo'
import { defaults, resolvers } from '@state/local'

export const apolloProvider = createProvider({
  wsEndpoint: null, // disable
  clientState: { defaults, resolvers },
})

export const apolloClient = apolloProvider.defaultClient

export const apolloOnLogin = token => onLogin(apolloClient, token)
export const apolloOnLogout = () => onLogout(apolloClient)
