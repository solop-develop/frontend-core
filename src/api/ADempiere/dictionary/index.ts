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
 * Request dictionary Window metadata
 * @param {number} id, identifier
 */
export function requestWindowMetadata({
  id
}) {
  return request({
    url: `/dictionary/windows/${id}`,
    method: 'get'
  })
    .then(windowResponse => {
      const { convertWindow } = require('@/utils/ADempiere/apiConverts/dictionary.js')
      return convertWindow(windowResponse)
    })
}

/**
 * GET Fields
 * @param {String} id
 */
export function requestFieldMetadata({
  id
}) {
  return request({
    url: `/dictionary/fields/${id}`,
    method: 'get'
    // params: {
    //   uuid,
    //   column_uuid: columnUuid,
    //   element_uuid: elementUuid,
    //   field_uuid: fieldUuid,
    //   // TableName + ColumnName
    //   table_name: tableName,
    //   column_name: columnName,
    //   element_column_name: elementColumnName
    // }
  })
    .then(fieldResponse => {
      const { convertField } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertField(fieldResponse)
    })
}

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

export function requestProcessMetadata({
  id
}) {
  return request({
    url: `/dictionary/processes/${id}`,
    method: 'get'
    // params: {
    //   id
    // }
  })
    .then(processResponse => {
      const { convertProcess } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertProcess(processResponse)
    })
}

/**
 * Request dictionary Smart Browser metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestBrowserMetadata({
  id
}) {
  return request({
    url: `/dictionary/browsers/${id}`,
    method: 'get'
  })
    .then(browserResponse => {
      const { convertBrowser } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertBrowser(browserResponse)
    })
}
