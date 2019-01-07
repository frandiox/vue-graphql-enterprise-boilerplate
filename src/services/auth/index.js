import auth0 from 'auth0-js'
import jwtDecode from 'jwt-decode'
import extractHash from '@utils/extract-hash'
import { Authenticate, GetSelf, LocalSetSelf, LocalGetSelf } from '@gql/user'
import { apolloClient, apolloOnLogin, apolloOnLogout } from '@state'
import { getSession, setSession, clearSession, isValidSession } from './session'

/* PRIVATE */

const socialConnection = {
  google: 'google-oauth2',
}

const authConfig = {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  redirectUri: `${window.location.origin}/login`,
  responseType: 'token id_token',
  scope: 'openid profile email',
}

const webAuth = new auth0.WebAuth(authConfig)

let singleSignOn
let renewAuthTimeout

/**
 * @description Shut down session
 */
function clearAuth() {
  clearSession()
  apolloOnLogout()
  singleSignOn = false

  clearTimeout(renewAuthTimeout)
}

/**
 * @description Save authentication data in localStorage
 */
export function setAuth(auth) {
  auth && setSession(auth)
  apolloOnLogin()
}

/**
 * @description Check if auth0 response (url hash) is correct
 */
function validateAuthResponse(hash = {}) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    webAuth.validateAuthenticationResponse({}, hash, (err, result) =>
      err ? reject(err) : resolve(result)
    )
  })
}

/**
 * @description Schedule authentication data renewal right before expiration
 */
function scheduleRenewAuth() {
  singleSignOn = true
  const { expiresAt } = getSession() || {}
  const expiresIn = Number(expiresAt) - Date.now()
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
      setAuth(authResult)
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

  clearAuth()

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
      setAuth(authResult)
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
  clearAuth()
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
    if (singleSignOn === undefined) {
      setAuth()
      scheduleRenewAuth()
    }
  } else if (singleSignOn !== false && !window.Cypress) {
    // If this is the first time or is already logged in
    // but session is not valid
    try {
      clearSession()
      await renewAuth()
    } catch (err) {
      err.error !== 'login_required' && console.error(err)
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
      try {
        const {
          data: { self: remoteUser },
        } = await apolloClient.query({
          query: GetSelf,
        })

        // Ensure permissions are correct
        const { accessToken } = getSession()
        if (accessToken && remoteUser) {
          const tokenInfo = jwtDecode(accessToken)
          const authClaimsKey = Object.keys(tokenInfo).find(key =>
            /^https:\/\/.*\/authInfo\/?/.test(key)
          )

          if (
            authClaimsKey &&
            tokenInfo[authClaimsKey].role !== remoteUser.role
          ) {
            await renewAuth()
          }
        }

        user = remoteUser
      } catch (err) {
        console.error(err)
        return null
      }

      // Store user locally
      await setCurrentUser(user)
    }
  }

  return user
}
