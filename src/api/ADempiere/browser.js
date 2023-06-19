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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Request a browser search
 * @param {string} uuid
 * @param {string} tableName
 * @param {array}  parametersList, This allows follow structure:
 *   [{
 *      columnName,
 *      key
 *   }]
 * @param {array}  filters
 * @param {array}  columns
 * @param {string} query
 * @param {string} whereClause
 * @param {number} limit
 * @param {string} orderByClause
 * @param {string} nextPageToken
 */
export function requestBrowserSearch({
  uuid,
  parametersList = [],
  tableName,
  contextAttributesList = [],
  nextPageToken: pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  const filters = parametersList.map(parameter => {
    return {
      column_name: parameter.columnName,
      value: parameter.value,
      value_to: parameter.valueTo,
      operator: parameter.operator
    }
  })

  // context attributes
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }

  return request({
    url: '/user-interface/smart-browser/browser-items',
    method: 'post',
    data: {
      // Running Parameters
      uuid,
      table_name: tableName,
      // DSL Query
      filters,
      // Custom Query
      context_attributes: contextAttributes
    },
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseBrowserSearch => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntityList(responseBrowserSearch)
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
