import auth0 from 'auth0-js'
import extractHash from '@utils/extract-hash'

const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'
const EXPIRES_AT = 'expires_at'

const socialConnection = {
  google: 'google-oauth2',
}

const authConfig = {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.VUE_APP_AUTH0_CB_URL,
}

const webAuth = new auth0.WebAuth({
  ...authConfig,
  responseType: 'token id_token',
})

const isValidSession = () => {
  return [ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].every(
    item => localStorage.getItem(item) !== null
  )
}

const setSession = ({ expiresIn, accessToken, idToken }) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
  localStorage.setItem(ID_TOKEN, idToken)

  // Set the time that the access token will expire at
  localStorage.setItem(
    EXPIRES_AT,
    JSON.stringify(expiresIn * 1000 + new Date().getTime())
  )
}

const clearSession = () => {
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

const getUserInfo = accessToken =>
  new Promise((resolve, reject) =>
    webAuth.client.userInfo(
      accessToken,
      (err, result) => (err ? reject(err) : resolve(result))
    )
  )

const tryToLogIn = () => {
  if (!isValidSession()) {
    const hash = extractHash(window.location, window.history)
    if (hash.id_token && hash.access_token) {
      validateTokens(hash).then(authResult => setSession(authResult))
    }
  }
}

const logout = () => {
  clearSession()
  webAuth.logout({
    returnTo: authConfig.redirectUri,
    clientID: authConfig.clientID,
  })
}

export {
  signupSelf,
  authorizeSelf,
  authorizeSocial,
  getUserInfo,
  tryToLogIn,
  logout,
}
