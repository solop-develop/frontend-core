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

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Request Entities
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestGetEntities({
  tabId,
  filters,
  referenceUuid,
  pageToken,
  searchValue,
  contextAttributes,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/user-interface/entities/${tabId}`,
    method: 'get',
    params: {
      filters,
      record_reference_uuid: referenceUuid,
      search_value: searchValue,
      context_attributes: contextAttributes,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(response => {
      return {
        nextPageToken: response.next_page_token,
        recordCount: response.record_count,
        records: response.records
      }
    })
}

/**
 * Create Tab Entity
 * @param {number} tabId
 * @param {array} attributesList
 */
export function createEntity({
  tabId,
  attributesList
}) {
  const attributesObject = {}
  attributesList.forEach(element => {
    attributesObject[element.columnName] = element.value
  })

  return request({
    url: `/user-interface/entities/${tabId}`,
    method: 'post',
    data: {
      attributes: attributesObject
    }
  })
}

/**
 * Update Tab Entity
 * @param {number} tabId
 * @param {array} attributesList
 */
export function updateEntity({
  reccordId,
  tabId,
  attributesList,
  keyColumnsList
}) {
  const attributesObject = {}
  attributesList.forEach(element => {
    attributesObject[element.columnName] = element.value
  })

  return request({
    url: `/user-interface/entities/${tabId}/${reccordId}`,
    method: 'patch',
    data: {
      attributes: {
        ...attributesObject,
        ...keyColumnsList
      }
    }
  })
}

/**
 * Delete Entity
 * @param {string}  tableName
 * @param {number}  recordId
 */

export function deleteEntity({
  tableName,
  recordId
}) {
  return request({
    url: `/business-data/entities/${tableName}/${recordId}`,
    method: 'delete'
  })
}
