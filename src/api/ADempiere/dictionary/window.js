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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Request dictionary Window metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestWindowMetadata({
  uuid,
  id
}) {
  return request({
    url: '/dictionary/window',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(windowResponse => {
      const { convertWindow } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertWindow(windowResponse)
    })
}

export function requestReference({
  uuid,
  columnName
}) {
  return request({
    url: '/dictionary/reference',
    method: 'get',
    params: {
      uuid,
      column_name: columnName
    }
  })
    .then(validationResponse => {
      const { convertReference } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertReference(validationResponse)
    })
}
