import auth0 from 'auth0-js'
import extractHash from '@utils/extract-hash'

const socialConnection = {
  google: 'google-oauth2',
}

const appAccessToken = 'access_token'
const appIdToken = 'id_token'
const appExpiresAt = 'expires_at'

const webAuth = new auth0.WebAuth({
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  responseType: 'token id_token',
  redirectUri: process.env.VUE_APP_AUTH0_CB_URL,
})

const checkSession = () => {
  if (
    localStorage.getItem(appAccessToken) === null ||
    localStorage.getItem(appIdToken) === null ||
    localStorage.getItem(appExpiresAt) === null
  ) {
    return false
  }
  return true
}

const setSession = authResult => {
  // Set the time that the access token will expire at
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )
  localStorage.setItem(appAccessToken, authResult.accessToken)
  localStorage.setItem(appIdToken, authResult.idToken)
  localStorage.setItem(appExpiresAt, expiresAt)
}

const unsetSession = () => {
  // Clear access token and ID token from local storage
  localStorage.removeItem(appAccessToken)
  localStorage.removeItem(appIdToken)
  localStorage.removeItem(appExpiresAt)
}

const validateTokens = (hash = {}) => {
  return new Promise((resolve, reject) => {
    webAuth.validateAuthenticationResponse({}, hash, (err, authResult) => {
      if (err) {
        reject(err)
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        // TODO: Validate the token signature
        resolve(authResult)
      } else {
        reject(new Error('No token was parsed'))
      }
    })
  })
}

// Public
const signupSelf = (user, passw) => {
  return new Promise((resolve, reject) => {
    webAuth.signup(
      {
        connection: 'Username-Password-Authentication',
        email: user,
        password: passw,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

const authorizeSelf = (user, passw) => {
  return new Promise((resolve, reject) => {
    webAuth.login(
      {
        realm: 'Username-Password-Authentication',
        username: user,
        password: passw,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

const authorizeSocial = connectionName => {
  webAuth.authorize({
    connection: socialConnection[connectionName],
  })
}

const getUserInfo = accessToken => {
  return new Promise((resolve, reject) => {
    webAuth.client.userInfo(accessToken, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const tryToLogIn = () => {
  if (!checkSession()) {
    const hash = extractHash()
    if (hash.id_token && hash.access_token) {
      validateTokens(hash).then(authResult => {
        setSession(authResult)
        return getUserInfo(authResult.accessToken)
      })
    }
  }
}

const logout = () => {
  // Clear access token and ID token from local storage
  unsetSession()

  return new Promise((resolve, reject) => {
    webAuth.logout(
      {
        returnTo: process.env.VUE_APP_AUTH0_CB_URL,
        clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
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
