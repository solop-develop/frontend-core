/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s):  Yamel Senih ysenih@erpya.com
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
 * Update browser entity
 * @param {number} id smart browser identifier
 * @param {string}uuid universally unique identifier
 * @param {array} attributesList
 */
export function updateBrowserEntity({
  id,
  uuid,
  recordId,
  attributesList
}) {
  return request({
    url: '/user-interface/smart-browser/update-browser-entity',
    method: 'post',
    data: {
      id,
      uuid,
      record_id: recordId,
      attributes: attributesList
    }
  })
    .then(browserEntityUpdateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(browserEntityUpdateResponse)
    })
}

/**
 * Delete Record Browser
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}  listRecordId
 */
export function requestDeleteBrowser({
  tableName,
  recordId,
  recordUuid,
  listRecordId
}) {
  const { deleteEntity } = require('@/api/ADempiere/common/persistence.js')

  return deleteEntity({
    tableName,
    recordId,
    recordUuid,
    listRecordId
  })
}
