/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.services
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'
import { getLanguage } from '@/lang/index'

/**
 * Make login by UserName and password, this function can return user data for show
 * @param {string} userName
 * @param {string} password
 * @param {number} roleId
 * @param {number} organizationId
 * @param {number} warehouseId
 * @param {number} lenguaje
 */
export function requestLogin({
  userName,
  password,
  roleId,
  organizationId,
  warehouseId
}) {
  const language = getLanguage() || 'en_US'

  return request({
    url: '/security/login',
    method: 'post',
    params: {
      language
    },
    data: {
      user_name: userName,
      user_pass: password,
      role_id: roleId,
      organization_id: organizationId,
      warehouse_id: warehouseId
    }
  })
    .then(response => {
      const { token } = response
      return token
    })
}

/**
 * Change session attribute
 * @param {number} warehouseId
 * @param {string} language
 */
export function setSessionAttribute({
  warehouseId,
  language
}) {
  return request({
    url: '/security/session-attribute',
    method: 'put',
    data: {
      warehouse_id: warehouseId,
      language
    }
  })
}

/**
 * Get User Info
 */
export function requestUserInfoFromSession() {
  return request({
    url: '/security/user-info',
    method: 'get'
  })
}

/**
 * Get session info
 */
export function requestSessionInfo() {
  return request({
    url: '/security/session-info',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Get Roles List
 * @param {numbre} pageSize
 * @param {string} pageToken
 */
export function requestRolesList() {
  return request({
    url: '/security/roles',
    method: 'get'
  })
    .then(response => {
      const { roles } = response
      return roles.map(list => camelizeObjectKeys(list))
    })
}

/**
 * Change role of access
 * @param {number} roleId
 * @param {number} organizationId
 * @param {number} warehouseId
 */
export function requestChangeRole({
  roleId,
  organizationId,
  warehouseId
}) {
  return request({
    url: '/security/change-role',
    method: 'put',
    data: {
      role_id: roleId,
      organization_id: organizationId,
      warehouse_id: warehouseId
    }
  })
}

/**
 * GET Menu
 */
export function requestMenu() {
  return request({
    url: '/security/menu',
    method: 'get'
  })
}

/**
 * GET Services
 */
export function services() {
  return request({
    url: '/security/services',
    method: 'get'
  })
    .then(response => {
      if (!response) {
        return []
      }
      return response.map(list => camelizeObjectKeys(list))
    })
}

/**
 * Request login from Open ID
 * @param {string} code
 * @param {string} state
 */
export function loginAuthentication({
  code,
  state
}) {
  return request({
    url: '/user/open-id/login',
    method: 'post',
    data: {
      code,
      state
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Logout from server
 */
export function requestLogout() {
  return request({
    method: 'post',
    url: '/security/logout'
  })
}

