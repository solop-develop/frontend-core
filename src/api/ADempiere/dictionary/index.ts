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
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * GET References
 * @param {String} id
 */
export function requestReference({
  id
}) {
  return request({
    url: `/dictionary/references/${id}`,
    method: 'get'
    // params: {
    //   uuid,
    //   column_name: columnName
    // }
  })
    .then(validationResponse => {
      const { convertReference } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertReference(validationResponse)
    })
}

/**
 * GET Process or Report dictionary metadata definition
 * @param {Number} id identifier
 * @param {String} language language
 * @param {Number} clientId client identifier
 * @param {Number} roleId role identifier
 * @param {Number} userId user identifier
 * @returns
 */
export function requestProcessMetadata({
  id,
  // mandatory to open search
  language,
  clientId,
  roleId,
  userId
}) {
  return request({
    url: `/dictionary/processes/${id}`,
    method: 'get',
    params: {
      language,
      client_id: clientId,
      role_id: roleId,
      user_id: userId
    }
  })
}

/**
 * Request dictionary Forms metadata
 * @param {number} id, identifier
 */
export function requestForm({
  id
}) {
  return request({
    url: `/dictionary/forms/${id}`,
    method: 'get'
  })
}

/**
 * Reques GET Search Info Fields
 */
export function tableSearchFields({
  tableName
}) {
  // const table_name = tableName
  return request({
    url: `/dictionary/forms/${tableName}`,
    method: 'get'
  })
    .then(response => {
      const { camelizeObjectKeys } = require('@/utils/ADempiere/transformObject.js')
      return {
        recordCount: response.record_count,
        fieldsList: response.fields.map(field => {
          return camelizeObjectKeys(field)
        }),
        nextPageToken: response.next_page_token
      }
    })
}

