// import Cookies from 'js-cookie'

/**
 * Prefix to Bearer tokem authorization
 */
export const BEARER_TYPE = 'Bearer'

const TokenKey = 'sessionUuid'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // Cookies.set(TokenKey, token)
  localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // Cookies.remove(TokenKey)
  localStorage.removeItem(TokenKey)
}

export * from '@/utils/ADempiere/auth'
