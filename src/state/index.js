import { createProvider, onLogin, onLogout } from '@state/vue-apollo'
import { typeDefs, resolvers, initialState } from '@state/local'
import { ACCESS_TOKEN } from '@services/auth/session'

export const apolloProvider = createProvider({
  tokenName: ACCESS_TOKEN,
  typeDefs,
  resolvers,
  onCacheInit: cache => {
    cache.writeData({ data: initialState })
  },
})

export const apolloClient = apolloProvider.defaultClient

export const apolloOnLogin = token => onLogin(apolloClient, token)
export const apolloOnLogout = () => onLogout(apolloClient)
