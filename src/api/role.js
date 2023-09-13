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

import { request } from '@/utils/ADempiere/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function requestRolesList() {
  return request({
    url: 'user/roles',
    method: 'get'
  })
    .then(responseRoles => {
      const { convertRole } = require('@/utils/ADempiere/apiConverts/user.js')
      const rolesList = responseRoles.map(itemRol => {
        return convertRole(itemRol)
      })

      return rolesList
    })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
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
    url: 'user/change-role',
    method: 'post',
    data: {
      role_id: roleId,
      organization_id: organizationId,
      warehouse_id: warehouseId
    }
  })
}
