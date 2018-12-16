export const ACCESS_TOKEN = 'access_token'
export const ID_TOKEN = 'id_token'
export const EXPIRES_AT = 'expires_at'

/**
 * @description Check if authentication data exists and is valid
 */
export function isValidSession() {
  return (
    [ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].every(
      item => localStorage.getItem(item) !== null
    ) && new Date().getTime() < JSON.parse(localStorage.getItem(EXPIRES_AT))
  )
}

/**
 * @description Save authentication data in localStorage
 */
export function setSession({ expiresIn, accessToken, idToken }) {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
  localStorage.setItem(ID_TOKEN, idToken)
  // Set the time that the access token will expire at
  localStorage.setItem(
    EXPIRES_AT,
    JSON.stringify(expiresIn * 1000 + Date.now())
  )
}

/**
 * @description Returns session information
 */
export function getSession() {
  return isValidSession()
    ? {
        expiresAt: localStorage.getItem(EXPIRES_AT),
        accessToken: localStorage.getItem(ACCESS_TOKEN),
      }
    : null
}

/**
 * @description Remove authentication data from localStorage
 */
export function clearSession() {
  // Clear access token and ID token from local storage
  ;[ACCESS_TOKEN, ID_TOKEN, EXPIRES_AT].forEach(item =>
    localStorage.removeItem(item)
  )
}
