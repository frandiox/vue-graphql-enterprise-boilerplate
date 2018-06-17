import auth0 from 'auth0-js'
import extractHash from '@utils/extract-hash'
import { Authenticate, GetSelf, LocalSetSelf, LocalGetSelf } from '@gql/user'
import { apolloClient, apolloOnLogin, apolloOnLogout } from '@state/index'

const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'
const EXPIRES_AT = 'expires_at'

const socialConnection = {
  google: 'google-oauth2',
}

const authConfig = {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.VUE_APP_DOMAIN + 'login',
}

const webAuth = new auth0.WebAuth({
  ...authConfig,
  responseType: 'token id_token',
  audience: `https://${authConfig.domain}/api/v2/`,
})

const isValidSession = () =>
  [ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].every(
    item => localStorage.getItem(item) !== null
  ) && new Date().getTime() < JSON.parse(localStorage.getItem(EXPIRES_AT))

const setSession = ({ expiresIn, accessToken, idToken }) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
  localStorage.setItem(ID_TOKEN, idToken)

  // Set the time that the access token will expire at
  localStorage.setItem(
    EXPIRES_AT,
    JSON.stringify(expiresIn * 1000 + new Date().getTime())
  )

  apolloOnLogin(accessToken)
}

const clearSession = () => {
  apolloOnLogout()
  // Clear access token and ID token from local storage
  return [ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].forEach(item =>
    localStorage.removeItem(item)
  )
}

const validateTokens = (hash = {}) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    webAuth.validateAuthenticationResponse(
      {},
      hash,
      (err, result) => (err ? reject(err) : resolve(result))
    )
  })
}

// Public
const signupSelf = (email, password) => {
  return new Promise((resolve, reject) => {
    webAuth.signup(
      {
        email,
        password,
        connection: 'Username-Password-Authentication',
      },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  })
}

const authorizeSelf = (username, password) => {
  return new Promise((resolve, reject) => {
    webAuth.login(
      {
        username,
        password,
        realm: 'Username-Password-Authentication',
      },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  })
}

const authorizeSocial = connectionName => {
  webAuth.authorize({
    connection: socialConnection[connectionName],
  })
}

const passwordReset = email => {
  return new Promise((resolve, reject) => {
    webAuth.changePassword(
      {
        email,
        connection: 'Username-Password-Authentication',
      },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  })
}

const tryToLogIn = async () => {
  if (!isValidSession()) {
    clearSession()

    const hash = extractHash(window.location, window.history)

    if (hash.id_token && hash.access_token) {
      try {
        const authResult = await validateTokens(hash)

        const {
          data: { authenticate: user },
        } = await apolloClient.mutate({
          mutation: Authenticate,
          variables: { idToken: authResult.idToken },
        })

        await setCurrentUser(user)
        setSession(authResult)

        console.log('Authenticated!', user, authResult) // eslint-disable-line no-console
        return true
      } catch (err) {
        console.error(err)
      }
    }
  }

  return false
}

const logout = () => {
  clearSession()
  setCurrentUser(null)

  webAuth.logout({
    returnTo: process.env.VUE_APP_DOMAIN + 'login',
    clientID: authConfig.clientID,
  })
}

const setCurrentUser = user => {
  return apolloClient.mutate({
    mutation: LocalSetSelf,
    variables: { user },
  })
}

const getCurrentUser = async () => {
  let user = null

  if (isValidSession()) {
    // Get local version
    let {
      data: { user: localUser },
    } = await apolloClient.query({ query: LocalGetSelf })

    user = localUser

    if (!user) {
      // Get remote version
      const {
        data: { getSelf: remoteUser },
      } = await apolloClient.query({
        query: GetSelf,
      })

      user = remoteUser

      // Store user locally
      await setCurrentUser(user)
    }
  }

  return user
}

export {
  signupSelf,
  authorizeSelf,
  authorizeSocial,
  passwordReset,
  getCurrentUser,
  setCurrentUser,
  tryToLogIn,
  logout,
}
