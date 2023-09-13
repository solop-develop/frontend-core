// import Cookies from 'js-cookie'

/**
 * Prefix to Bearer tokem authorization
 */
export const BEARER_TYPE = 'Bearer'

const TOKEN_KEY = 'sessionUuid'

export function getToken() {
  // return Cookies.get(TOKEN_KEY)
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  // Cookies.set(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  // Cookies.remove(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export * from '@/utils/ADempiere/auth'
