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

// Constants
import { RECORD_ROWS_BY_LIST } from '@/utils/ADempiere/dictionary/field/lookups'

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
      role_id: Number(roleId),
      organization_id: Number(organizationId),
      warehouse_id: Number(warehouseId)
    }
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
export function requestMenu({
  language,
  clientId,
  roleId,
  userId
}) {
  return request({
    url: '/security/menus',
    method: 'get',
    params: {
      language,
      role_id: roleId,
      client_id: clientId,
      user_id: userId,
      page_size: 100
    }
  })
}

/**
 * GET Services
 */
export function requestServices() {
  return request({
    url: '/security/services',
    method: 'get'
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
    url: '/security/login-open-id',
    method: 'post',
    data: {
      code_parameter: code,
      state_parameter: state
    }
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

/**
 * Get Organizations list by Role
 * @param param0
 * @returns
 */
export function organizationsListRequest({
  roleId,
  pageToken,
  pageSize = RECORD_ROWS_BY_LIST
}) {
  return request({
    url: '/security/organizations',
    method: 'get',
    params: {
      role_id: roleId,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(organizationsListResponse => {
      return {
        nextPageToken: organizationsListResponse.next_page_token,
        recordCount: organizationsListResponse.record_count,
        organizationsList: organizationsListResponse.organizations.map(organization => {
          return camelizeObjectKeys(organization)
        })
      }
    })
}

/**
 * Get Warehouses by Organization
 * @param organizationId
 * @returns
 */
export function warehousesListRequest({
  organizationId,
  pageToken,
  pageSize = RECORD_ROWS_BY_LIST
}) {
  return request({
    url: '/security/warehouses',
    method: 'get',
    params: {
      organization_id: organizationId,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}
