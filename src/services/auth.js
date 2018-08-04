import auth0 from 'auth0-js'
import extractHash from '@utils/extract-hash'
import { Authenticate, GetSelf, LocalSetSelf, LocalGetSelf } from '@gql/user'
import { apolloClient, apolloOnLogin, apolloOnLogout } from '@state'

/* PRIVATE */

const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'
const EXPIRES_AT = 'expires_at'

const socialConnection = {
  google: 'google-oauth2',
}

const authConfig = {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  redirectUri: `${window.location.origin}/login`,
  responseType: 'token id_token',
  scope: 'openid profile',
}

const webAuth = new auth0.WebAuth(authConfig)

let singleSignOn
let renewAuthTimeout

/**
 * @description Save authentication data in localStorage
 */
function setSession({ expiresIn, accessToken, idToken }) {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
  localStorage.setItem(ID_TOKEN, idToken)
  // Set the time that the access token will expire at
  localStorage.setItem(
    EXPIRES_AT,
    JSON.stringify(expiresIn * 1000 + Date.now())
  )

  apolloOnLogin(accessToken)
}

/**
 * @description Remove authentication data from localStorage
 */
function clearSession() {
  // Clear access token and ID token from local storage
  ;[ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].forEach(item =>
    localStorage.removeItem(item)
  )

  apolloOnLogout()
  singleSignOn = false

  clearTimeout(renewAuthTimeout)
}

/**
 * @description Check if authentication data exists and is valid
 */
function isValidSession() {
  return (
    [ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].every(
      item => localStorage.getItem(item) !== null
    ) && new Date().getTime() < JSON.parse(localStorage.getItem(EXPIRES_AT))
  )
}

/**
 * @description Check if auth0 response (url hash) is correct
 */
function validateAuthResponse(hash = {}) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    webAuth.validateAuthenticationResponse(
      {},
      hash,
      (err, result) => (err ? reject(err) : resolve(result))
    )
  })
}

/**
 * @description Schedule authentication data renewal right before expiration
 */
function scheduleRenewAuth() {
  singleSignOn = true
  const expiresIn = Number(localStorage.getItem(EXPIRES_AT)) - Date.now()
  clearTimeout(renewAuthTimeout)

  // Schedule token renewal 1 minute before expiration
  renewAuthTimeout = setTimeout(renewAuth, expiresIn - 60000)
}

/**
 * @description Refresh authentication data based on Auth0's Single Sign On (SSO)
 */
function renewAuth() {
  const { audience, scope } = authConfig
  return new Promise((resolve, reject) => {
    webAuth.checkSession({ audience, scope }, (err, authResult) => {
      if (err) return reject(err)
      setSession(authResult)
      scheduleRenewAuth()
      resolve(authResult)
    })
  })
}

/* PUBLIC */

/**
 * @description Signup current user with the provided credentials
 * @param {String} email User's email
 * @param {String} password User's password
 * @returns {Promise<Object>} Auth result or error object
 */
export function signupSelf(email, password) {
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

/**
 * @description Send login attempt to Auth0 with the provided credentials
 * @param {String} username User's username (normally email)
 * @param {String} password User's password
 * @returns {Promise<Object>} Auth result or error object
 */
export function authorizeSelf(username, password) {
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

/**
 * @description Attempt to login with the provided social network
 * @param {String} connectionName Name of the social network connection (e.g. "google")
 */
export function authorizeSocial(connectionName) {
  webAuth.authorize({
    connection: socialConnection[connectionName],
  })
}

/**
 * @description Reset user's password
 * @param {String} email User's email for password reset
 * @returns {Promise<Object>} Password change result or error object
 */
export function passwordReset(email) {
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

/**
 * @description Try to login the current user based on hash response from Auth0
 * @returns {Promise<Boolean>} Wether the session is logged in
 */
export async function tryToLogIn() {
  if (isValidSession()) return true

  clearSession()

  const hash = extractHash(window.location, window.history)

  if (hash.id_token && hash.access_token) {
    try {
      const authResult = await validateAuthResponse(hash)
      console.log('Trying to login...', authResult) // eslint-disable-line no-console

      const {
        data: { authenticate: user },
      } = await apolloClient.mutate({
        mutation: Authenticate,
        variables: { idToken: authResult.idToken },
      })

      await setCurrentUser(user)
      setSession(authResult)
      scheduleRenewAuth()

      console.log('Authenticated!', user) // eslint-disable-line no-console
      return true
    } catch (err) {
      console.error(err)
    }
  }

  return false
}

/**
 * @description Remove local session data and Auth0's Single Sign On session
 */
export function logout() {
  clearSession()
  setCurrentUser(null)

  const { clientID } = authConfig

  webAuth.logout({
    clientID,
    returnTo: `${window.location.origin}/login`,
  })
}

/**
 * @description Store user information locally
 * @param {Object} user User object
 * @returns {Promise<Object>} Local mutation result
 */
export function setCurrentUser(user) {
  return apolloClient.mutate({
    mutation: LocalSetSelf,
    variables: { user },
  })
}

/**
 * @description Ensure current session validity and renewal if Single Sign On is valid
 */
export async function checkSession() {
  if (isValidSession()) {
    // If this is the first time and session is valid
    singleSignOn === undefined && scheduleRenewAuth()
  } else if (singleSignOn !== false && !window.Cypress) {
    // If this is the first time or is already logged in
    // but session is not valid
    try {
      await renewAuth()
    } catch (err) {
      err.error !== 'login_required' && console.error(err)
      clearSession()
    }
  }
}

/**
 * @description Ensure the current user information is stored locally
 * @returns {Promise<Object>} Current user's information or null
 */
export async function getCurrentUser() {
  let user = null

  if (isValidSession()) {
    // Get local version if exists
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
