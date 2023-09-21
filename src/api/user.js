/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Instance for connection
import { request } from '@/utils/ADempiere/request'

// Utils and Helper Methods
import { getLanguage } from '@/lang/index'

/**
 * Make login by UserName and password, this function can return user data for show
 * @param {string} userName
 * @param {string} password
 * @param {number} roleId
 * @param {number} organizationId
 * @param {number} warehouseId
 */
export function requestLogin({
  userName,
  password,
  roleId,
  organizationId,
  warehouseId,
  token
}) {
  const language = getLanguage() || 'en_US'

  return request({
    url: '/user/login',
    method: 'post',
    params: {
      language
    },
    data: {
      username: userName,
      password,
      role_id: roleId,
      organization_id: organizationId,
      warehouse_id: warehouseId,
      token
    }
  })
}

/**
 * Get User Info
 */
export function requestUserInfoFromSession() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * Get session info
 */
export function requestSessionInfo() {
  return request({
    url: '/user/session',
    method: 'get'
  })
    .then(responseSession => {
      const { convertSession } = require('@/utils/ADempiere/apiConverts/user.js')

      return convertSession(responseSession)
    })
}

/**
 * Get User menu from server
 * @deprecated
 */
export function requestMenu() {
  return request({
    url: '/user/menu',
    method: 'get'
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
    url: '/user/logout'
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
    url: 'user/set-session-attribute',
    method: 'put',
    data: {
      warehouse_id: warehouseId,
      language
    }
  })
}

/**
 * Get User Activity
 */
export function requestUserActivity({
  date
}) {
  return request({
    url: '/user/log/user-activities',
    method: 'get',
    params: {
      date
    }
  })
    .then(response => {
      return response
    })
}
