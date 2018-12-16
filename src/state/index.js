import { createProvider, onLogin, onLogout } from '@state/vue-apollo'
import { defaults, resolvers } from '@state/local'
import { ACCESS_TOKEN } from '@services/auth/session'

export const apolloProvider = createProvider({
  tokenName: ACCESS_TOKEN,
  clientState: { defaults, resolvers },
})

export const apolloClient = apolloProvider.defaultClient

export const apolloOnLogin = token => onLogin(apolloClient, token)
export const apolloOnLogout = () => onLogout(apolloClient)
