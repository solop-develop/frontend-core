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

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Request dictionary Smart Browser metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestBrowserSearch({
  id,
  filters,
  pageToken,
  contextAttributes,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/user-interface/browser-items/${id}`,
    method: 'get',
    params: {
      filters,
      context_attributes: contextAttributes,
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

/**
 * Request dictionary Smart Browser metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function browserExportRequest({
  id,
  filters,
  contextAttributes
}) {
  return request({
    url: `/user-interface/browser-items/${id}/export`,
    method: 'get',
    params: {
      filters,
      context_attributes: contextAttributes
    }
  })
}

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
    url: `/user-interface/browser-items/${id}/${recordId}`,
    method: 'patch',
    data: {
      id,
      uuid,
      record_id: recordId,
      attributes: attributesList
    }
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
  const { requestDeleteEntity } = require('@/api/ADempiere/business-data/entities.ts')

  return requestDeleteEntity({
    tableName,
    recordId,
    recordUuid,
    listRecordId
  })
}
